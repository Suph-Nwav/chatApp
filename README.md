Ứng dụng chat real-time được xây dựng với Next.js, Material-UI và TypeScript.

## 🚀 Tech Stack

- **Framework**: Next.js 16.1.6 (App Router)
- **Language**: TypeScript
- **UI Library**: Material-UI (MUI) v6
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Date Formatting**: date-fns
- **Styling**: MUI System + CSS-in-JS

## 📁 Cấu trúc thư mục

```
chat-application/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Trang chính (chat)
│   ├── login/               # Trang đăng nhập
│   └── register/            # Trang đăng ký
│
├── components/              # React components
│   ├── auth/               # Components liên quan authentication
│   │   ├── AuthLayout.tsx  # Layout cho login/register
│   │   ├── AuthProvider.tsx # Provider quản lý auth state
│   │   ├── LoginForm.tsx   # Form đăng nhập
│   │   └── RegisterForm.tsx # Form đăng ký
│   │
│   ├── chat/               # Components chat
│   │   ├── ChatPlaceholder.tsx      # Placeholder khi chưa chọn conversation
│   │   ├── ConversationList.tsx     # Danh sách conversations
│   │   ├── MessageInput.tsx         # Input gửi tin nhắn
│   │   ├── MessageList.tsx          # Danh sách messages
│   │   ├── NewConversationDialog.tsx # Dialog tạo conversation mới
│   │   └── UserSearchList.tsx       # List kết quả search user
│   │
│   └── common/             # Components dùng chung
│       ├── Logo.tsx        # Logo component
│       ├── SyncUserButton.tsx # Button sync thông tin user
│       └── UserProfile.tsx # Profile user ở sidebar
│
├── hooks/                  # Custom React hooks
│   ├── useAuth.ts         # Hook xử lý authentication
│   ├── useAuthGuard.ts    # Hook bảo vệ routes
│   ├── useDebounce.ts     # Hook debounce input
│   └── useUser.ts         # Hook quản lý user info
│
├── services/              # API services
│   ├── auth.service.ts    # Auth APIs (login, register)
│   ├── conversation.service.ts # Conversation APIs
│   ├── message.service.ts # Message APIs
│   └── user.service.ts    # User APIs (search)
│
├── store/                 # Zustand stores
│   └── useUserStore.ts   # Store lưu thông tin user
│
├── types/                 # TypeScript types
│   ├── api.types.ts      # API response types
│   ├── auth.types.ts     # Auth types
│   ├── chat.types.ts     # Chat types
│   └── index.ts          # Export tất cả types
│
├── api/                   # API configuration
│   ├── axioClient.ts     # Axios instance với interceptors
│   └── apiEnpoints.ts    # API endpoints constants
│
└── public/               # Static files
    └── ...
```

## 🔑 Tính năng chính

### Authentication
- Đăng ký tài khoản mới
- Đăng nhập với email/password
- Auto-redirect sau đăng ký
- Token management (localStorage)
- Auto-refresh token (401 handling)

### Chat
- Danh sách conversations
- Tìm kiếm user để tạo conversation
- Gửi/nhận tin nhắn text
- Phân biệt tin nhắn của mình và người khác
- Hiển thị avatar, tên người gửi
- Format thời gian tin nhắn
- Optimistic update với tempId

### UI/UX
- Dark theme (Discord-inspired)
- Responsive design
- Loading states
- Empty states với animation
- Hover effects
- Auto-scroll messages
- Sidebar toggle (mobile)

## 🛠️ Chi tiết kỹ thuật

### State Management

**Zustand Store** (`useUserStore`):
- Lưu thông tin user hiện tại
- Persist vào sessionStorage
- Không lưu tokens (tokens ở localStorage)

### API Integration

**Axios Client** với interceptors:
- Request: Tự động thêm Bearer token
- Response: Handle 401 → logout + redirect
- Base URL: `http://localhost:8088`

**API Services**:
- Tách biệt theo domain (auth, conversation, message, user)
- Type-safe với TypeScript
- Centralized error handling

### Routing & Guards

**App Router** (Next.js 16):
- `/` - Trang chat (protected)
- `/login` - Đăng nhập
- `/register` - Đăng ký

**Auth Guard** (`useAuthGuard`):
- Check authentication
- Auto-redirect nếu chưa login
- Sử dụng ở protected pages

### Component Patterns

**Composition**:
- Tách components nhỏ, tái sử dụng
- Props drilling tối thiểu
- Custom hooks cho logic phức tạp

**Styling**:
- MUI `sx` prop cho inline styles
- Theme colors: Discord-inspired
- Responsive với MUI breakpoints

## 🎨 Design System

### Colors
- Background: `#36393f`, `#2f3136`
- Primary: `#5865f2` (Discord blue)
- Success: `#43b581` (Discord green)
- Text: `#fff`, `#b9bbbe`, `#72767d`
- Border: `#202225`

### Typography
- Font sizes: `0.6875rem` - `1.5rem`
- Font weights: 400, 600, 700

### Spacing
- Padding: `8px`, `16px`, `24px`
- Gap: `8px`, `12px`, `16px`
- Border radius: `8px`, `16px`

## 📦 Dependencies

### Core
- `next`: ^16.1.6
- `react`: ^19.0.0
- `typescript`: ^5

### UI
- `@mui/material`: ^6.3.1
- `@mui/icons-material`: ^6.3.1
- `@emotion/react`: ^11.14.0

### State & Data
- `zustand`: ^5.0.2
- `axios`: ^1.7.9
- `date-fns`: ^4.1.0

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm hoặc yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

### Environment Variables

Tạo file `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8088
```

### Build & Deploy

```bash
# Build production
npm run build

# Start production server
npm start
```

## 📝 Code Conventions

### Naming
- Components: PascalCase (`UserProfile.tsx`)
- Hooks: camelCase với prefix `use` (`useAuth.ts`)
- Services: camelCase với suffix `.service` (`auth.service.ts`)
- Types: PascalCase với suffix `Type`, `Request`, `Response`

### File Organization
- 1 component = 1 file
- Export default cho main component
- Named exports cho utilities

### TypeScript
- Strict mode enabled
- Explicit return types cho functions
- Interface cho objects, Type cho unions

## 🔐 Security

- Tokens stored in localStorage (XSS protected)
- HTTPS only in production
- CORS configured on backend
- Input validation
- Auto-logout on 401

## 🎯 Future Enhancements

- [ ] WebSocket integration (real-time)
- [ ] File upload (images, documents)
- [ ] Group chat
- [ ] Message reactions
- [ ] Typing indicators
- [ ] Read receipts
- [ ] Push notifications
- [ ] Dark/Light theme toggle

