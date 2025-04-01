# ZKWasm Deployment Service

ZKWasm部署服务是一个基于Next.js的Web应用，用于帮助用户轻松地将ZKWasm应用部署到Kubernetes集群中。

## 功能特点

- **简单部署**：通过GitHub仓库URL直接部署应用
- **分支支持**：支持从特定的Git分支进行部署
- **Kubernetes集成**：简化Kubernetes部署流程
- **高级部署选项**：支持自定义环境变量、链ID配置等
- **Mini-Services支持**：可选部署Deposit和Settlement服务

## 快速开始

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

打开[http://localhost:3000](http://localhost:3000)即可访问应用。

### 环境变量配置

创建一个`.env.local`文件并配置以下环境变量：

```
KUBECONFIG_BASE64=<base64编码的kubeconfig文件内容>
```

要生成base64编码的kubeconfig：

```bash
cat ~/kube/config | base64 -w 0 > kubeconfig_base64.txt
```

然后将`kubeconfig_base64.txt`的内容复制到`.env.local`文件中。

## 使用指南

### 测试Kubernetes连接

访问[http://localhost:3000/test-k8s](http://localhost:3000/test-k8s)页面来测试与Kubernetes集群的连接。

### 部署应用

1. 访问[http://localhost:3000/simple-deploy](http://localhost:3000/simple-deploy)页面
2. 输入GitHub仓库URL（例如：`https://github.com/username/repository`）
3. 指定Kubernetes命名空间
4. 如需更多选项，点击"显示高级选项"
5. 点击"部署"按钮

### 高级部署选项

- **链ID**：指定区块链网络ID
- **Mini-Services**：启用/禁用Deposit和Settlement服务
- **MD5镜像值**：提供特定镜像的MD5哈希值
- **自定义环境变量**：以JSON格式指定额外的环境变量

## 技术栈

- [Next.js](https://nextjs.org) - React框架
- [TypeScript](https://www.typescriptlang.org/) - 类型安全的JavaScript
- [TailwindCSS](https://tailwindcss.com) - 实用优先的CSS框架
- [pnpm](https://pnpm.io/) - 快速、节省磁盘空间的包管理器

## 构建生产版本

```bash
pnpm build
```

构建完成后，可以使用以下命令启动生产服务器：

```bash
pnpm start
```

## 部署说明

此应用可以部署到任何支持Node.js的平台。对于生产环境，推荐使用Docker容器化部署。
