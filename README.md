# AudioAura

AudioAura is a portfolio-quality, single-vendor ecommerce platform for premium
audio electronics.

The project is organized as a small monorepo:

- `client/` contains the React customer and admin interfaces.
- `server/` contains the Express REST API and MongoDB data access.
- `docs/` contains architecture and engineering decisions.

## Current progress

AudioAura now includes the core full-stack ecommerce flow:

- React homepage, product listing, product details, cart, checkout, order
  history, authentication pages, and admin dashboard.
- Express REST API with products, search/filter/sort/pagination, users, JWT
  authentication, persistent MongoDB carts, fake checkout orders, inventory
  reduction, and admin product/order management.
- MongoDB/Mongoose models for Product, User, Cart, and Order.
- Centralized API error handling and backend API tests.

See [docs/architecture.md](docs/architecture.md) for the system design, data
flow, request lifecycle, and folder responsibilities.

## Run locally

Use PowerShell commands from the project root.

1. Install backend dependencies:

   ```powershell
   cd server
   npm.cmd install
   ```

2. Create `server/.env` from `server/.env.example` and set:

   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/audioaura
   JWT_SECRET=replace-with-a-long-random-secret
   JWT_EXPIRES_IN=7d
   CLIENT_URL=http://localhost:5173
   ```

3. Seed sample products:

   ```powershell
   npm.cmd run seed
   ```

4. Start the API:

   ```powershell
   npm.cmd run dev
   ```

5. In a second terminal, start the React app:

   ```powershell
   cd client
   npm.cmd install
   npm.cmd run dev
   ```

6. Open `http://localhost:5173`.

## Verification

```powershell
cd server
npm.cmd test

cd ..\client
npm.cmd run lint
npm.cmd run build
```
