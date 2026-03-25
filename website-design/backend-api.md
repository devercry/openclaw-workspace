# 精密仪器公司官网后端API架构设计

> 参考：卓立汉光 (https://www.zolix.com.cn) - 专业精密仪器制造商

---

## 目录

1. [数据库Schema设计](#1-数据库schema设计)
2. [RESTful API端点设计](#2-restful-api端点设计)
3. [数据模型关系图](#3-数据模型关系图)
4. [缓存策略建议](#4-缓存策略建议)

---

## 1. 数据库Schema设计

### 1.1 数据库选型

- **主数据库**: PostgreSQL 15+ (支持JSON、全文搜索、事务)
- **缓存层**: Redis 7+ (热点数据、会话、限流)
- **搜索引擎**: Elasticsearch (产品搜索、全文检索)

### 1.2 表结构设计

#### 1.2.1 分类表 (categories)

```sql
CREATE TABLE categories (
    id              SERIAL PRIMARY KEY,
    parent_id       INTEGER REFERENCES categories(id) ON DELETE CASCADE,
    name            VARCHAR(100) NOT NULL,
    slug            VARCHAR(100) UNIQUE NOT NULL,
    description     TEXT,
    icon_url        VARCHAR(500),
    banner_url      VARCHAR(500),
    sort_order      INTEGER DEFAULT 0,
    is_active       BOOLEAN DEFAULT TRUE,
    is_featured     BOOLEAN DEFAULT FALSE,
    meta_title      VARCHAR(200),
    meta_description VARCHAR(500),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 索引
CREATE INDEX idx_categories_parent ON categories(parent_id);
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_active ON categories(is_active);
CREATE INDEX idx_categories_sort ON categories(sort_order);
```

#### 1.2.2 产品表 (products)

```sql
CREATE TABLE products (
    id              SERIAL PRIMARY KEY,
    category_id     INTEGER NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    sku             VARCHAR(50) UNIQUE NOT NULL,
    name            VARCHAR(200) NOT NULL,
    slug            VARCHAR(200) UNIQUE NOT NULL,
    subtitle        VARCHAR(300),
    description     TEXT,
    specifications  JSONB,           -- 技术规格，灵活存储
    features        JSONB,           -- 产品特性数组
    images          JSONB,           -- 图片数组 [{url, alt, is_main}]
    attachments     JSONB,           -- 附件 [{name, url, file_type}]
    price           DECIMAL(12, 2),  -- 公开报价（可为空）
    currency        VARCHAR(3) DEFAULT 'CNY',
    stock_status    VARCHAR(20) DEFAULT 'in_stock', -- in_stock, out_of_stock, pre_order
    is_active       BOOLEAN DEFAULT TRUE,
    is_featured     BOOLEAN DEFAULT FALSE,
    is_new          BOOLEAN DEFAULT FALSE,
    view_count      INTEGER DEFAULT 0,
    sort_order      INTEGER DEFAULT 0,
    meta_title      VARCHAR(200),
    meta_description VARCHAR(500),
    meta_keywords   VARCHAR(300),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    published_at    TIMESTAMP
);

-- 索引
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_products_featured ON products(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_products_new ON products(is_new) WHERE is_new = TRUE;
CREATE INDEX idx_products_sort ON products(sort_order);
CREATE INDEX idx_products_specs ON products USING GIN(specifications);
CREATE INDEX idx_products_published ON products(published_at);
```

#### 1.2.3 产品分类关联表 (product_categories)

```sql
-- 支持多分类关联
CREATE TABLE product_categories (
    product_id      INTEGER REFERENCES products(id) ON DELETE CASCADE,
    category_id     INTEGER REFERENCES categories(id) ON DELETE CASCADE,
    is_primary      BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (product_id, category_id)
);

CREATE INDEX idx_pc_category ON product_categories(category_id);
CREATE INDEX idx_pc_primary ON product_categories(is_primary) WHERE is_primary = TRUE;
```

#### 1.2.4 应用案例表 (case_studies)

```sql
CREATE TABLE case_studies (
    id              SERIAL PRIMARY KEY,
    title           VARCHAR(200) NOT NULL,
    slug            VARCHAR(200) UNIQUE NOT NULL,
    summary         TEXT,
    content         TEXT NOT NULL,
    cover_image     VARCHAR(500),
    gallery         JSONB,           -- 案例图片集
    industry        VARCHAR(100),    -- 所属行业
    products_used   JSONB,           -- 使用的产品ID数组
    customer_name   VARCHAR(200),    -- 客户名称（可匿名）
    location        VARCHAR(100),
    results         JSONB,           -- 成果数据
    is_active       BOOLEAN DEFAULT TRUE,
    is_featured     BOOLEAN DEFAULT FALSE,
    view_count      INTEGER DEFAULT 0,
    sort_order      INTEGER DEFAULT 0,
    meta_title      VARCHAR(200),
    meta_description VARCHAR(500),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    published_at    TIMESTAMP
);

CREATE INDEX idx_cs_slug ON case_studies(slug);
CREATE INDEX idx_cs_industry ON case_studies(industry);
CREATE INDEX idx_cs_active ON case_studies(is_active);
CREATE INDEX idx_cs_featured ON case_studies(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_cs_published ON case_studies(published_at);
```

#### 1.2.5 新闻资讯表 (articles)

```sql
CREATE TABLE articles (
    id              SERIAL PRIMARY KEY,
    category_id     INTEGER REFERENCES article_categories(id) ON DELETE SET NULL,
    author_id       INTEGER REFERENCES users(id) ON DELETE SET NULL,
    title           VARCHAR(200) NOT NULL,
    slug            VARCHAR(200) UNIQUE NOT NULL,
    summary         TEXT,
    content         TEXT NOT NULL,
    cover_image     VARCHAR(500),
    tags            JSONB,
    is_active       BOOLEAN DEFAULT TRUE,
    is_top          BOOLEAN DEFAULT FALSE,
    is_recommended  BOOLEAN DEFAULT FALSE,
    view_count      INTEGER DEFAULT 0,
    meta_title      VARCHAR(200),
    meta_description VARCHAR(500),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    published_at    TIMESTAMP
);

CREATE INDEX idx_articles_category ON articles(category_id);
CREATE INDEX idx_articles_slug ON articles(slug);
CREATE INDEX idx_articles_author ON articles(author_id);
CREATE INDEX idx_articles_active ON articles(is_active);
CREATE INDEX idx_articles_published ON articles(published_at);
```

#### 1.2.6 文章分类表 (article_categories)

```sql
CREATE TABLE article_categories (
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(100) NOT NULL,
    slug            VARCHAR(100) UNIQUE NOT NULL,
    description     TEXT,
    sort_order      INTEGER DEFAULT 0,
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 1.2.7 公司信息表 (company_info)

```sql
CREATE TABLE company_info (
    id              SERIAL PRIMARY KEY,
    info_type       VARCHAR(50) NOT NULL, -- about, contact, history, culture, honor, team
    title           VARCHAR(200),
    content         TEXT,
    data            JSONB,           -- 结构化数据
    sort_order      INTEGER DEFAULT 0,
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_company_type ON company_info(info_type);
```

#### 1.2.8 轮播图表 (banners)

```sql
CREATE TABLE banners (
    id              SERIAL PRIMARY KEY,
    title           VARCHAR(200),
    subtitle        VARCHAR(300),
    image_url       VARCHAR(500) NOT NULL,
    mobile_image_url VARCHAR(500),
    link_url        VARCHAR(500),
    link_type       VARCHAR(20) DEFAULT 'internal', -- internal, external
    position        VARCHAR(50) NOT NULL, -- home, product, about, etc.
    sort_order      INTEGER DEFAULT 0,
    is_active       BOOLEAN DEFAULT TRUE,
    start_at        TIMESTAMP,
    end_at          TIMESTAMP,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_banners_position ON banners(position);
CREATE INDEX idx_banners_active ON banners(is_active);
```

#### 1.2.9 用户表 (users)

```sql
CREATE TABLE users (
    id              SERIAL PRIMARY KEY,
    email           VARCHAR(255) UNIQUE NOT NULL,
    password_hash   VARCHAR(255) NOT NULL,
    name            VARCHAR(100) NOT NULL,
    avatar          VARCHAR(500),
    phone           VARCHAR(20),
    role            VARCHAR(20) DEFAULT 'editor', -- admin, editor, viewer
    is_active       BOOLEAN DEFAULT TRUE,
    last_login      TIMESTAMP,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

#### 1.2.10 询盘/留言表 (inquiries)

```sql
CREATE TABLE inquiries (
    id              SERIAL PRIMARY KEY,
    product_id      INTEGER REFERENCES products(id) ON DELETE SET NULL,
    name            VARCHAR(100) NOT NULL,
    email           VARCHAR(255) NOT NULL,
    phone           VARCHAR(20),
    company         VARCHAR(200),
    subject         VARCHAR(200),
    message         TEXT NOT NULL,
    ip_address      INET,
    status          VARCHAR(20) DEFAULT 'pending', -- pending, processing, completed, spam
    notes           TEXT,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_inquiries_product ON inquiries(product_id);
CREATE INDEX idx_inquiries_status ON inquiries(status);
CREATE INDEX idx_inquiries_created ON inquiries(created_at);
```

#### 1.2.11 文件资源表 (media_files)

```sql
CREATE TABLE media_files (
    id              SERIAL PRIMARY KEY,
    filename        VARCHAR(255) NOT NULL,
    original_name   VARCHAR(255),
    file_path       VARCHAR(500) NOT NULL,
    file_url        VARCHAR(500) NOT NULL,
    file_type       VARCHAR(50),     -- image, document, video
    mime_type       VARCHAR(100),
    file_size       BIGINT,
    width           INTEGER,
    height          INTEGER,
    alt_text        VARCHAR(255),
    uploaded_by     INTEGER REFERENCES users(id),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_media_type ON media_files(file_type);
CREATE INDEX idx_media_uploaded ON media_files(uploaded_by);
```

---

## 2. RESTful API端点设计

### 2.1 API规范

- **基础URL**: `https://api.example.com/v1`
- **数据格式**: JSON
- **认证方式**: JWT Token (Bearer)
- **分页参数**: `page`, `per_page` (默认20，最大100)
- **排序参数**: `sort` (字段名), `order` (asc/desc)

### 2.2 响应格式

```json
{
  "code": 200,
  "message": "success",
  "data": { },
  "meta": {
    "page": 1,
    "per_page": 20,
    "total": 100,
    "total_pages": 5
  }
}
```

### 2.3 产品模块 API

#### 获取产品列表
```http
GET /products
```

**查询参数:**
| 参数 | 类型 | 说明 |
|------|------|------|
| category_id | integer | 分类ID |
| category_slug | string | 分类别名 |
| search | string | 关键词搜索 |
| is_featured | boolean | 是否推荐 |
| is_new | boolean | 是否新品 |
| min_price | decimal | 最低价格 |
| max_price | decimal | 最高价格 |
| page | integer | 页码 |
| per_page | integer | 每页数量 |
| sort | string | 排序字段 |
| order | string | 排序方向 |

**响应示例:**
```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": 1,
      "sku": "SPEC-001",
      "name": "激光拉曼光谱仪",
      "slug": "laser-raman-spectrometer",
      "subtitle": "高分辨率科研级光谱仪",
      "cover_image": "https://cdn.example.com/images/spec-001.jpg",
      "price": 158000.00,
      "currency": "CNY",
      "stock_status": "in_stock",
      "is_featured": true,
      "is_new": false,
      "category": {
        "id": 1,
        "name": "光谱仪",
        "slug": "spectrometers"
      }
    }
  ],
  "meta": {
    "page": 1,
    "per_page": 20,
    "total": 156,
    "total_pages": 8
  }
}
```

#### 获取产品详情
```http
GET /products/{slug}
```

**响应示例:**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "sku": "SPEC-001",
    "name": "激光拉曼光谱仪",
    "slug": "laser-raman-spectrometer",
    "subtitle": "高分辨率科研级光谱仪",
    "description": "<p>产品详细介绍...</p>",
    "specifications": {
      "wavelength_range": "200-1000nm",
      "resolution": "0.1nm",
      "detector": "CCD",
      "interface": "USB 3.0"
    },
    "features": [
      "高灵敏度检测",
      "快速数据采集",
      "用户友好软件"
    ],
    "images": [
      {
        "url": "https://cdn.example.com/images/spec-001-main.jpg",
        "alt": "激光拉曼光谱仪正面",
        "is_main": true
      }
    ],
    "attachments": [
      {
        "name": "产品手册.pdf",
        "url": "https://cdn.example.com/docs/spec-001-manual.pdf",
        "file_type": "pdf"
      }
    ],
    "price": 158000.00,
    "currency": "CNY",
    "stock_status": "in_stock",
    "category": {
      "id": 1,
      "name": "光谱仪",
      "slug": "spectrometers"
    },
    "related_products": [
      {
        "id": 2,
        "name": "荧光光谱仪",
        "slug": "fluorescence-spectrometer",
        "cover_image": "..."
      }
    ],
    "view_count": 3256,
    "meta_title": "激光拉曼光谱仪 - 卓立汉光",
    "meta_description": "..."
  }
}
```

#### 获取产品分类树
```http
GET /categories/tree
```

**响应示例:**
```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": 1,
      "name": "光谱仪",
      "slug": "spectrometers",
      "icon_url": "https://cdn.example.com/icons/spectrometer.svg",
      "children": [
        {
          "id": 2,
          "name": "拉曼光谱仪",
          "slug": "raman-spectrometers",
          "product_count": 12
        }
      ]
    }
  ]
}
```

#### 获取分类详情
```http
GET /categories/{slug}
```

### 2.4 应用案例模块 API

#### 获取案例列表
```http
GET /case-studies
```

**查询参数:**
| 参数 | 类型 | 说明 |
|------|------|------|
| industry | string | 行业筛选 |
| product_id | integer | 相关产品 |
| is_featured | boolean | 推荐案例 |
| page | integer | 页码 |
| per_page | integer | 每页数量 |

**响应示例:**
```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": 1,
      "title": "某高校材料分析实验室建设",
      "slug": "university-material-lab",
      "summary": "为某985高校搭建完整的材料表征分析平台...",
      "cover_image": "https://cdn.example.com/cases/case-001.jpg",
      "industry": "教育科研",
      "customer_name": "某知名高校",
      "location": "北京",
      "published_at": "2024-03-15T10:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "per_page": 12,
    "total": 48
  }
}
```

#### 获取案例详情
```http
GET /case-studies/{slug}
```

### 2.5 新闻资讯模块 API

#### 获取文章列表
```http
GET /articles
```

**查询参数:**
| 参数 | 类型 | 说明 |
|------|------|------|
| category_id | integer | 分类ID |
| category_slug | string | 分类别名 |
| tag | string | 标签筛选 |
| is_top | boolean | 置顶文章 |
| is_recommended | boolean | 推荐文章 |
| page | integer | 页码 |
| per_page | integer | 每页数量 |

#### 获取文章详情
```http
GET /articles/{slug}
```

#### 获取文章分类
```http
GET /article-categories
```

### 2.6 公司信息模块 API

#### 获取公司信息
```http
GET /company/{type}
```

**type 可选值:** about, contact, history, culture, honors, team

**响应示例 (contact):**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "title": "联系我们",
    "content": "...",
    "data": {
      "company_name": "北京卓立汉光仪器有限公司",
      "address": "北京市海淀区中关村...",
      "phone": "400-XXX-XXXX",
      "email": "sales@example.com",
      "business_hours": "周一至周五 9:00-18:00",
      "social_media": {
        "wechat": "zolix_official",
        "weibo": "@卓立汉光"
      }
    }
  }
}
```

### 2.7 首页/公共模块 API

#### 获取首页数据
```http
GET /home
```

**响应示例:**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "banners": [
      {
        "id": 1,
        "title": "精密仪器领导者",
        "subtitle": "20年专注光谱仪器研发",
        "image_url": "https://cdn.example.com/banners/home-1.jpg",
        "mobile_image_url": "https://cdn.example.com/banners/home-1-mobile.jpg",
        "link_url": "/products"
      }
    ],
    "featured_categories": [...],
    "featured_products": [...],
    "new_products": [...],
    "featured_cases": [...],
    "latest_articles": [...],
    "statistics": {
      "product_count": 500,
      "customer_count": 10000,
      "year_experience": 20
    }
  }
}
```

#### 获取轮播图
```http
GET /banners?position={position}
```

### 2.8 询盘模块 API

#### 提交询盘
```http
POST /inquiries
```

**请求体:**
```json
{
  "product_id": 1,
  "name": "张三",
  "email": "zhangsan@example.com",
  "phone": "13800138000",
  "company": "某科技有限公司",
  "subject": "产品咨询",
  "message": "想了解激光拉曼光谱仪的详细参数和报价"
}
```

#### 搜索建议
```http
GET /search/suggestions?q={keyword}
```

---

## 3. 数据模型关系图

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              数据模型关系图                                   │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│   categories    │         │    products     │         │  case_studies   │
├─────────────────┤         ├─────────────────┤         ├─────────────────┤
│ PK id           │◄────────┤ PK id           │         │ PK id           │
│ FK parent_id    │    1:N  │ FK category_id  │         │ title           │
│ name            │         │ sku             │         │ slug            │
│ slug            │         │ name            │         │ industry        │
│ description     │         │ specifications  │         │ products_used   │◄────┐
│ icon_url        │         │ price           │         │ is_featured     │     │
│ is_featured     │         │ is_active       │         └─────────────────┘     │
└─────────────────┘         │ view_count      │                                 │
         ▲                  └─────────────────┘                                 │
         │                          ▲                                           │
         │                          │                                           │
         │                   ┌──────┴──────┐                                    │
         │                   │ product_    │                                    │
         │                   │ categories  │                                    │
         │                   │ (关联表)     │                                    │
         │                   └─────────────┘                                    │
         │                                                                      │
         │                  ┌─────────────────┐                                 │
         │                  │  article_       │                                 │
         │                  │  categories     │                                 │
         │                  ├─────────────────┤                                 │
         │                  │ PK id           │                                 │
         │                  │ name            │                                 │
         │                  │ slug            │                                 │
         │                  └─────────────────┘                                 │
         │                           ▲                                          │
         │                           │                                          │
         │                  ┌────────┴────────┐                                 │
         │                  │    articles     │                                 │
         │                  ├─────────────────┤                                 │
         │                  │ PK id           │                                 │
         │                  │ FK category_id  │                                 │
         │                  │ FK author_id    │◄────────────────────────────────┤
         │                  │ title           │                                 │
         │                  │ content         │                                 │
         │                  │ tags            │                                 │
         │                  │ is_top          │                                 │
         │                  └─────────────────┘                                 │
         │                                                                      │
         │                  ┌─────────────────┐                                 │
         └──────────────────┤     users       │                                 │
                            ├─────────────────┤                                 │
                            │ PK id           │─────────────────────────────────┘
                            │ email           │         (产品关联案例)
                            │ name            │
                            │ role            │
                            └─────────────────┘

┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│     banners     │         │  company_info   │         │   inquiries     │
├─────────────────┤         ├─────────────────┤         ├─────────────────┤
│ PK id           │         │ PK id           │         │ PK id           │
│ position        │         │ info_type       │         │ FK product_id   │◄──┐
│ image_url       │         │ title           │         │ name            │   │
│ link_url        │         │ content         │         │ email           │   │
│ is_active       │         │ data (JSONB)    │         │ phone           │   │
│ sort_order      │         │ is_active       │         │ message         │   │
└─────────────────┘         └─────────────────┘         │ status          │   │
                                                        └─────────────────┘   │
                                                                              │
┌─────────────────┐                                                           │
│  media_files    │                                                           │
├─────────────────┤                                                           │
│ PK id           │                                                           │
│ filename        │                                                           │
│ file_url        │                                                           │
│ file_type       │                                                           │
│ file_size       │                                                           │
└─────────────────┘                                                           │
        ▲                                                                     │
        │                                                                     │
        └─────────────────────────────────────────────────────────────────────┘
                        (各表通过 images/attachments 字段关联媒体文件)
```

### 3.1 核心关系说明

| 关系 | 类型 | 说明 |
|------|------|------|
| categories ↔ products | 1:N | 一个分类下有多款产品 |
| products ↔ case_studies | N:M | 产品与案例多对多关联 |
| article_categories ↔ articles | 1:N | 文章分类与文章 |
| users ↔ articles | 1:N | 作者与文章 |
| products ↔ inquiries | 1:N | 产品与询盘 |
| categories ↔ categories | 1:N | 分类自关联（父子级） |

---

## 4. 缓存策略建议

### 4.1 缓存架构

```
┌─────────────────────────────────────────────────────────────────┐
│                         缓存分层架构                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐        │
│   │  CDN缓存    │    │  Redis缓存  │    │ 应用内存缓存 │        │
│   │ (静态资源)  │    │ (热点数据)  │    │ (本地缓存)   │        │
│   └──────┬──────┘    └──────┬──────┘    └──────┬──────┘        │
│          │                  │                  │               │
│          ▼                  ▼                  ▼               │
│   ┌─────────────────────────────────────────────────────┐      │
│   │                  API Gateway                        │      │
│   └─────────────────────────────────────────────────────┘      │
│                              │                                  │
│                              ▼                                  │
│   ┌─────────────────────────────────────────────────────┐      │
│   │              Backend Services (Node.js/Go)          │      │
│   └─────────────────────────────────────────────────────┘      │
│                              │                                  │
│                              ▼                                  │
│   ┌─────────────────────────────────────────────────────┐      │
│   │              PostgreSQL + Elasticsearch             │      │
│   └─────────────────────────────────────────────────────┘      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 缓存策略矩阵

| 数据类型 | 缓存层级 | TTL | 策略 |
|---------|---------|-----|------|
| 产品列表 | Redis | 5分钟 | 分页缓存，更新时失效 |
| 产品详情 | Redis | 10分钟 | 按slug缓存，更新时失效 |
| 分类树 | Redis | 30分钟 | 全量缓存，变更时刷新 |
| 首页数据 | Redis | 2分钟 | 聚合数据，定时刷新 |
| 文章列表 | Redis | 5分钟 | 分页缓存 |
| 文章详情 | Redis | 30分钟 | 长期缓存 |
| 公司信息 | Redis | 1小时 | 静态数据长期缓存 |
| 轮播图 | Redis | 10分钟 | 按位置缓存 |
| 搜索结果 | Redis | 3分钟 | 按关键词缓存 |
| 热门产品 | Redis | 1小时 | 定时统计更新 |

### 4.3 缓存Key设计

```
# 产品相关
product:list:{category_id}:{page}:{per_page}:{sort}
product:detail:{slug}
product:featured
product:new
product:related:{product_id}

# 分类相关
category:tree
category:detail:{slug}
category:products:{category_id}

# 文章相关
article:list:{category_id}:{page}:{per_page}
article:detail:{slug}
article:top
article:recommended

# 案例相关
case:list:{industry}:{page}:{per_page}
case:detail:{slug}
case:featured

# 首页
home:data
banner:{position}

# 搜索
search:suggest:{keyword_hash}
search:result:{query_hash}

# 公司信息
company:{type}
```

### 4.4 缓存失效策略

```
┌─────────────────────────────────────────────────────────────────┐
│                      缓存失效流程                                │
└─────────────────────────────────────────────────────────────────┘

数据变更事件
      │
      ▼
┌─────────────┐
│  写入数据库  │
└──────┬──────┘
       │
       ▼
┌─────────────┐     ┌─────────────────┐
│  发送消息到  │────►│  Redis Pub/Sub  │
│  消息队列   │     │  or RabbitMQ    │
└─────────────┘     └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
       ┌──────────┐   ┌──────────┐   ┌──────────┐
       │ 清除产品  │   │ 清除分类  │   │ 清除首页  │
       │ 相关缓存  │   │ 相关缓存  │   │ 相关缓存  │
       └──────────┘   └──────────┘   └──────────┘
```

### 4.5 缓存代码示例

```javascript
// Node.js + Redis 缓存示例

// 缓存装饰器
async function cacheWrapper(key, ttl, fetchFn) {
  const cached = await redis.get(key);
  if (cached) {
    return JSON.parse(cached);
  }
  
  const data = await fetchFn();
  await redis.setex(key, ttl, JSON.stringify(data));
  return data;
}

// 产品列表缓存
async function getProductList(params) {
  const cacheKey = `product:list:${params.category_id}:${params.page}:${params.per_page}`;
  
  return cacheWrapper(cacheKey, 300, async () => {
    return await db.products.findAll({
      where: { category_id: params.category_id, is_active: true },
      limit: params.per_page,
      offset: (params.page - 1) * params.per_page,
      order: [['sort_order', 'ASC']]
    });
  });
}

// 缓存失效
async function invalidateProductCache(productId) {
  const product = await db.products.findByPk(productId);
  
  // 删除具体产品缓存
  await redis.del(`product:detail:${product.slug}`);
  
  // 删除列表缓存（使用通配符删除）
  const listKeys = await redis.keys('product:list:*');
  if (listKeys.length > 0) {
    await redis.del(...listKeys);
  }
  
  // 删除首页缓存
  await redis.del('home:data');
}
```

### 4.6 性能优化建议

1. **数据库层面**
   - 使用连接池 (pg-pool)
   - 慢查询监控与优化
   - 定期分析表 (ANALYZE)

2. **缓存层面**
   - 热点数据预加载
   - 缓存穿透防护 (布隆过滤器)
   - 缓存雪崩防护 (随机TTL)

3. **API层面**
   - 接口限流 (Rate Limiting)
   - 请求合并 (DataLoader)
   - 响应压缩 (Gzip/Brotli)

4. **CDN层面**
   - 静态资源长期缓存
   - 图片自适应裁剪
   - 全球节点分发

---

## 5. 安全建议

### 5.1 API安全
- 使用 HTTPS 传输
- JWT Token 认证
- 接口限流 (Rate Limiting)
- SQL注入防护 (参数化查询)
- XSS防护 (输出编码)

### 5.2 数据安全
- 敏感数据加密存储
- 数据库访问权限控制
- 定期备份策略
- 审计日志记录

---

## 6. 部署架构建议

```
┌─────────────────────────────────────────────────────────────────┐
│                        生产环境架构                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌──────────┐    ┌──────────┐    ┌──────────┐                 │
│   │   Nginx  │    │   Nginx  │    │   Nginx  │  (负载均衡)      │
│   │ (LB)     │    │ (Static) │    │ (Cache)  │                 │
│   └────┬─────┘    └────┬─────┘    └────┬─────┘                 │
│        │               │               │                        │
│        └───────────────┼───────────────┘                        │
│                        │                                        │
│        ┌───────────────┼───────────────┐                        │
│        ▼               ▼               ▼                        │
│   ┌──────────┐    ┌──────────┐    ┌──────────┐                 │
│   │ API      │    │ API      │    │ API      │  (应用集群)      │
│   │ Server 1 │    │ Server 2 │    │ Server N │                 │
│   └────┬─────┘    └────┬─────┘    └────┬─────┘                 │
│        │               │               │                        │
│        └───────────────┼───────────────┘                        │
│                        │                                        │
│        ┌───────────────┼───────────────┐                        │
│        ▼               ▼               ▼                        │
│   ┌──────────┐    ┌──────────┐    ┌──────────┐                 │
│   │PostgreSQL│    │  Redis   │    │Elasticsearch│               │
│   │ (Master) │    │ (Cluster)│    │  (Cluster)  │               │
│   │ (Slave)  │    │          │    │             │               │
│   └──────────┘    └──────────┘    └──────────┘                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

*文档版本: v1.0*  
*最后更新: 2026-03-25*  
*作者: Backend Architect Agent*
