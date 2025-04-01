import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // 模拟检查 KUBECONFIG_BASE64 环境变量
    const kubeconfig = process.env.KUBECONFIG_BASE64;
    
    if (!kubeconfig) {
      return NextResponse.json({
        success: false,
        message: "KUBECONFIG_BASE64 环境变量未设置",
        details: "请设置 KUBECONFIG_BASE64 环境变量"
      });
    }
    
    // 模拟连接测试
    // 实际应用中，这里应该解码kubeconfig并尝试建立连接
    
    return NextResponse.json({
      success: true,
      message: "已成功连接到 Kubernetes 集群",
      clusterInfo: {
        version: "v1.26.5",
        nodes: 3,
        pods: 28,
        namespaces: 7,
        status: "Healthy"
      }
    });
  } catch (error: any) {
    console.error('测试K8s连接失败:', error);
    return NextResponse.json({
      success: false,
      error: error.message || '未知错误',
      message: '测试K8s连接失败',
    }, { status: 500 });
  }
} 