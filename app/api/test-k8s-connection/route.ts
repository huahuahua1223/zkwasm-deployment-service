import { NextResponse } from 'next/server';
import * as k8s from '@kubernetes/client-node';

export async function GET() {
  try {
    // 检查 KUBECONFIG_BASE64 环境变量
    const kubeconfig = process.env.KUBECONFIG_BASE64;
    
    if (!kubeconfig) {
      return NextResponse.json({
        success: false,
        message: "KUBECONFIG_BASE64 environment variable is not set",
        details: "please set the KUBECONFIG_BASE64 environment variable"
      });
    }
    
    // 解码 base64 编码的 kubeconfig
    const decodedKubeconfig = Buffer.from(kubeconfig, 'base64').toString('utf-8');
    
    // 创建 kube 配置
    const kc = new k8s.KubeConfig();
    kc.loadFromString(decodedKubeconfig);
    
    // 创建核心API客户端
    const k8sCoreApi = kc.makeApiClient(k8s.CoreV1Api);
    
    // 获取集群版本信息
    const versionApi = kc.makeApiClient(k8s.VersionApi);
    const versionResponse = await versionApi.getCode();
    
    // 获取节点
    const nodesResponse = await k8sCoreApi.listNode();
    
    // 获取所有命名空间
    const namespacesResponse = await k8sCoreApi.listNamespace();
    
    // 获取所有Pod
    const podsResponse = await k8sCoreApi.listPodForAllNamespaces();
    
    return NextResponse.json({
      success: true,
      message: "successfully connected to kubernetes cluster",
      clusterInfo: {
        version: versionResponse.gitVersion,
        nodes: nodesResponse.items.length,
        pods: podsResponse.items.length,
        namespaces: namespacesResponse.items.length,
        status: "Healthy"
      }
    });
  } catch (error: any) {
    console.error('test k8s connection failed:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'unknown error',
      message: 'test k8s connection failed',
    }, { status: 500 });
  }
} 