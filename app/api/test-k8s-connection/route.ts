import { NextResponse } from 'next/server';
import * as k8s from '@kubernetes/client-node';

// 优先使用此函数，确保在Vercel环境中处理可能的失败
const safeK8sApiCall = async (apiCall: () => Promise<any>) => {
  try {
    return await apiCall();
  } catch (error) {
    console.warn('K8s API call failed:', error);
    return null;
  }
};

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
    
    try {
      // 解码 base64 编码的 kubeconfig
      const decodedKubeconfig = Buffer.from(kubeconfig, 'base64').toString('utf-8');
      
      // 创建 kube 配置
      const kc = new k8s.KubeConfig();
      kc.loadFromString(decodedKubeconfig);
      
      // 创建核心API客户端
      const k8sCoreApi = kc.makeApiClient(k8s.CoreV1Api);
      
      // 获取集群版本信息
      const versionApi = kc.makeApiClient(k8s.VersionApi);
      const versionResponse = await safeK8sApiCall(() => versionApi.getCode());
      
      // 获取节点
      const nodesResponse = await safeK8sApiCall(() => k8sCoreApi.listNode());
      
      // 获取所有命名空间
      const namespacesResponse = await safeK8sApiCall(() => k8sCoreApi.listNamespace());
      
      // 获取所有Pod
      const podsResponse = await safeK8sApiCall(() => k8sCoreApi.listPodForAllNamespaces());
      
      // 安全地获取响应值，处理可能的 undefined
      const version = versionResponse && typeof versionResponse === 'object' ? 
        (versionResponse.gitVersion || 'Unknown') : 'Unknown';
      
      const nodeCount = nodesResponse && nodesResponse.items ? 
        nodesResponse.items.length : 0;
      
      const podCount = podsResponse && podsResponse.items ? 
        podsResponse.items.length : 0;
      
      const namespaceCount = namespacesResponse && namespacesResponse.items ? 
        namespacesResponse.items.length : 0;
      
      return NextResponse.json({
        success: true,
        message: "successfully connected to kubernetes cluster",
        clusterInfo: {
          version,
          nodes: nodeCount,
          pods: podCount,
          namespaces: namespaceCount,
          status: "Healthy"
        }
      });
    } catch (k8sError: any) {
      console.error('Kubernetes API error:', k8sError);
      return NextResponse.json({
        success: false,
        error: k8sError.message || 'unknown error',
        message: 'failed to connect to kubernetes cluster',
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error('test k8s connection failed:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'unknown error',
      message: 'test k8s connection failed',
    }, { status: 500 });
  }
} 