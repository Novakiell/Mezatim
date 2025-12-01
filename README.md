###  **Mezatım - Online Auction Platform**
Mezatım is a comprehensive auction platform that allows users to list products, place bids, and make purchases in real time. Developed using modern web technologies, this project features an architecture focused on high performance, security, and user experience.**

---

### **About the Project**

This project combines the logic of traditional e-commerce with real-time interaction. Users can sell their products with a “Buy Now” price or hand over the item to the highest bidder through an auction system. With features such as wallet management, live messaging, instant notifications, and a detailed admin panel, the system offers a fully equipped marketplace experience.

---

### **Key Features**

• **Real-Time Bidding System:** Instant price updates and bid tracking without page refresh using WebSocket technology. <br>

<img width="1360" height="712" alt="jr28r1a" src="https://github.com/user-attachments/assets/b1804d1e-089b-479e-8712-31e1c3fb36b3" />

• **Secure Payment & Wallet Infrastructure:** Transactions based on user balances, balance-loading simulation, and transaction history tracking. <br>

<img width="1810" height="782" alt="9r0d8os" src="https://github.com/user-attachments/assets/cd080d12-cd79-4d9b-afe2-8df59cd93b02" />

• **Comprehensive Product Management:** Multiple image upload, category selection, product condition (New/Used) assignment, and draft (storage) system. <br>

<img width="602" height="777" alt="aof2ng7" src="https://github.com/user-attachments/assets/43af0b81-73c5-45c8-bc4b-20e310ab4061" />

• **Live Chat Module:** Real-time messaging between buyer and seller for each product. <br>
• **User Interaction:** Add to favorites, rate seller, and leave a review. <br>

<img width="1908" height="782" alt="8mnx7t7" src="https://github.com/user-attachments/assets/e175618b-3deb-41ec-999b-73ba2eb59a33" />

• **Admin Dashboard:** View platform statistics, manage users, and remove inappropriate listings. <br>

<img width="1918" height="650" alt="ojm4k4c" src="https://github.com/user-attachments/assets/9a719986-f453-407f-8611-c425e3096c10" />

• **Responsive Design:** Mobile-optimized UI and PWA (Progressive Web App) support. <br>
• **Dark Mode Support:** Light and dark theme options working consistently across the system.

<img width="1910" height="795" alt="ahqv99y" src="https://github.com/user-attachments/assets/9105d595-5159-49f8-b33b-fa8c6d3bd99d" />

<img width="1910" height="795" alt="m9c4n3q" src="https://github.com/user-attachments/assets/6675f843-b487-476e-b81a-5c412358f6a5" />




---

### **Technologies Used**

#### **Frontend:**

* React.js
* Vite
* Tailwind CSS (v4)
* Framer Motion (Animations)
* React Router DOM
* React Hot Toast (Notifications)

#### **Backend & Database:**

* Supabase (PostgreSQL)
* Supabase Auth (Authentication)
* Supabase Storage (File Storage)
* Supabase Realtime (Live Data Streaming)
* PostgreSQL Functions (RPC - Secure Logic Execution)

---

### **Installation Steps**

To run the project in a local environment, follow the steps below:

#### **Clone the Repository:**

```bash
git clone https://github.com/YOUR_USERNAME/mezatim.git
cd mezatim
```

#### **Install Dependencies:**

```bash
npm install
```

#### **Set Environment Variables:**

Create a `.env` file in the root directory and add your Supabase project information:

```
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_KEY=your_supabase_anon_key
```

#### **Start the Application:**

```bash
npm run dev
```

---

### **Database Structure**

The project uses the following relational table structure on Supabase:

| Table             | Description                                       |
| ----------------- | ------------------------------------------------- |
| **profiles**      | User info, balance, role management (admin/user). |
| **products**      | Product details, pricing, condition, timers.      |
| **bids**          | Bid history and user associations.                |
| **messages**      | Product-based messaging between users.            |
| **favorites**     | User watchlist.                                   |
| **reviews**       | Seller ratings and review system.                 |
| **transactions**  | Balance top-ups and spending history.             |
| **notifications** | In-system user notifications.                     |

**Note:** Security is ensured through Row Level Security (RLS) policies and database functions (RPC).

---

### **Contribution**

If you wish to contribute to the project, please create a **Fork**, then submit a **Pull Request** with your changes. All feedback and suggestions are welcome.


---

**Developer:** *Furkan Şeremet* <br>
**Contact:** *([LinkedIn](https://tr.linkedin.com/in/furkanseremet))*
