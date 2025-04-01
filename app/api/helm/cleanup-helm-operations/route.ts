import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // 模拟清理逻辑
    console.log('Cleanup request received:', data);
    
    // 模拟处理时间
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return NextResponse.json({
      success: true,
      message: `已成功清理命名空间 ${data.namespace} 中的发布 ${data.releaseName} 的操作（模拟响应）`
    });
  } catch (error: any) {
    console.error('清理失败:', error);
    return NextResponse.json({
      success: false,
      error: error.message || '未知错误',
      message: '清理操作失败',
    }, { status: 500 });
  }
} 