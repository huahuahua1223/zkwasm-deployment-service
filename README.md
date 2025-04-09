# ZKWasm Deployment Service

ZKWasm部署服务是一个基于Next.js的Web应用，用于帮助用户轻松地将ZKWasm应用部署到Kubernetes集群中。该服务包含完整的用户认证系统，支持多种登录方式和账户管理功能。

## 功能特点

- **用户认证系统**
  - 多种登录方式：用户名/邮箱密码、GitHub、Google
  - 完整的注册与邮箱验证流程
  - 密码找回与重置功能
  - 个人资料管理
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

查看`.env.example`，创建一个`.env.local`文件并配置以下环境变量：

```
# Kubernetes配置
KUBECONFIG_BASE64=<base64编码的kubeconfig文件内容>

# 认证相关配置
NEXTAUTH_SECRET=<用于JWT加密的密钥>
NEXTAUTH_URL=http://localhost:3000

# 数据库配置
MONGODB_URI=<MongoDB连接字符串>

# 邮件服务配置（用于验证邮件、密码重置等）
EMAIL_SERVER_HOST=<SMTP服务器地址>
EMAIL_SERVER_PORT=<SMTP服务器端口>
EMAIL_SERVER_USER=<SMTP用户名>
EMAIL_SERVER_PASSWORD=<SMTP密码>
EMAIL_FROM=<发送邮件的地址>

# OAuth提供商配置
GITHUB_ID=<GitHub OAuth应用ID>
GITHUB_SECRET=<GitHub OAuth应用密钥>
GOOGLE_CLIENT_ID=<Google OAuth客户端ID>
GOOGLE_CLIENT_SECRET=<Google OAuth客户端密钥>
```

要生成base64编码的kubeconfig：

```bash
cat ~/kube/config | base64 -w 0 > kubeconfig_base64.txt
```

然后将`kubeconfig_base64.txt`的内容复制到`.env.local`文件中。

### 数据库配置
```bash
use zkwasm_auth

// 创建一个集合以初始化数据库（MongoDB 需要至少有一个集合才会创建数据库）
db.createCollection("users")
```

## 用户认证系统

### 登录方式

- **账号密码**：使用用户名/邮箱和密码登录
- **社交登录**：支持GitHub和Google OAuth登录
- **安全保障**：密码加密存储，防止泄露

### 注册流程

1. 用户填写注册信息（用户名、邮箱、密码）
2. 系统发送验证邮件到用户邮箱
3. 用户点击邮件中的验证链接完成注册
4. 验证成功后可以登录系统

### 账户管理

- **个人资料**：修改用户名和个人信息
- **密码修改**：安全地更改账户密码
- **密码找回**：通过邮箱验证重置密码

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
- [NextAuth.js](https://next-auth.js.org/) - 认证解决方案
- [MongoDB](https://www.mongodb.com/) - NoSQL数据库
- [Mongoose](https://mongoosejs.com/) - MongoDB对象建模
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

## 安全注意事项

- 在生产环境中，请确保使用HTTPS
- 定期更新依赖包以修复安全漏洞
- 使用强密钥用于NEXTAUTH_SECRET
- 确保MongoDB实例已正确配置安全访问控制
