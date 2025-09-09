# 项目文件结构说明

## 前端文件结构
```
web/
├── src/                  # 前端源代码目录
│   ├── components/       # 可复用UI组件
│   │   ├── Header.tsx    # 顶部导航栏组件
│   │   ├── QuestionCard.tsx # 问题卡片组件
│   │   └── QuestionModal.tsx # 提问模态框组件
│   ├── hooks/           # 自定义React Hooks
│   ├── pages/           # 页面组件
│   │   └── Home.tsx     # 主页面组件
│   ├── utils/           # 工具函数
│   │   └── apiService.ts # API服务封装
│   ├── App.tsx          # 应用根组件
│   └── main.tsx         # 应用入口文件
├── package.json         # 前端项目依赖配置
├── Dockerfile           # 前端Docker构建配置
└── vite.config.ts       # Vite构建配置
```

## 后端文件结构
```
server/
├── src/                  # 后端源代码目录
│   ├── middleware/       # Express中间件
│   │   └── auth.ts       # 认证中间件
│   ├── utils/            # 工具函数
│   │   ├── jwtUtils.ts    # JWT工具
│   │   └── passwordUtils.ts # 密码工具
│   ├── app.ts            # Express应用主文件
│   └── index.ts          # 服务启动入口
├── package.json          # 后端项目依赖配置
└── Dockerfile            # 后端Docker构建配置
```

## 项目配置文件
```
├── .rules/               # 项目规范文档
│   ├── arch.md           # 系统架构文档
│   └── ProjectRule.md    # 项目开发规范
├── docker-compose.yml    # 容器编排配置
└── README.md             # 项目说明文档
```

[返回项目规范文档](./ProjectRule.md)