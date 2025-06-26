# 🧭 AI Travel Planner

An intelligent travel itinerary generator that helps users plan personalized trips based on destination, number of days, and budget. The app uses AI and Google APIs to generate day-wise travel plans with location photos and maps.

---

## 🔗 Live Link

👉 [View Live App](https://ai-travel-planner-pi.vercel.app/)

---

## 🚀 Features

- ✨ AI-generated travel itinerary
- 📍 Google Places API integration
- 🗓 Day-by-day trip view
- 🖼️ Auto-fetch photos of places
- 👤 Google Sign-In authentication
- 💾 My Trips dashboard with stored itineraries
- 🌍 Google Maps integration

---

## 🛠️ Tech Stack

| Category        | Tech                          |
|----------------|-------------------------------|
| Frontend       | React + Vite, Tailwind CSS    |
| Components     | shadcn/ui, React Icons        |
| Authentication | Google OAuth via Firebase     |
| Backend        | Firebase Firestore            |
| APIs           | Google Places API             |
| Routing        | React Router DOM              |

---

## 📁 Project Structure

```
ai-travel-planner/
├── public/
│   └── placeholder.avif
├── src/
│   ├── components/
│   ├── view-trip/
│   ├── my-trips/
│   ├── service/
│   └── App.jsx
├── .env
├── vite.config.js
├── package.json
└── README.md
```

---

## 🔐 Environment Variables

Create a `.env` file in the root and add your API key:

```env
VITE_GOOGLE_PLACE_API_KEY=your_google_places_api_key
```

---

## 🧪 Getting Started

```bash
# 1. Clone the repository
git clone https://github.com/HardikaTandel/AI-TravelPlanner.git

# 2. Navigate to the folder
cd AI-TravelPlanner

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

---

## 🔮 Future Enhancements

- 🗺️ Interactive map with markers
- 🏨 Hotel and restaurant recommendations
- 📤 Share and export trip plans
- 🧑‍🤝‍🧑 Group trip collaboration
- 📅 Calendar sync

---

## 👩‍💻 Author

Made  by [Hardika Tandel](https://github.com/HardikaTandel)

---

## 📄 License

This project is licensed under the MIT License.
