(for english, scroll down)

პროექტში გამოყენებულია:

- Next.js 15.2.3
- CoinCap API
- Node.js v20.10.0
- npm v10.2.3.

დაკლონვის შემდეგ გაუშვით:

1.  `npm install`
2.  `npm run dev`

### არქიტექტურული გადაწყვეტილები:

- პროექტში გამოყენებულია სოკეტები ინფორმაციის ლაივ რეჟიმში განსაახლებლად, თუ სოკეტი გაფეილდა ყოველ ერთ წუთში ავტომატურად მოხდება დატას წამოღება.
- ქეშირებისთვის, ერთი და იგივე დატას სწრაფი მიღებისთვის და უკვე დაფეტჩილი დატის სხვადასხვა ადგილებში გამოყენების და განახლების მიზნით ვიყენებ react-query-ს
- თითოეული ასეტის ფეიჯი სტატიკურია და ბილდის დროს გენერირდება HTML ფაილად, უკეთესი პერფორმანსისთვის (ნახლდება ინფორმაცია ყოველ 1 საათში, ვიცი რომ არასწორია სავაჭრო ჩარტისთვის თუმცა სატესტო რადგანაა…)
- მთავარ გვერდზე, დატა იფეტჩება მხოლოდ ერთხელ და შემდეგ ნახლდება სოკეტების დახმარებით, რათა მომხმარებელს ყოველთვის ახალი ინფორმაცია ქონდეს
- ასეტების დატა არის ერეის ფორმატის, რისი შეცვლაც სოკეტიდან მოსული აფდეითისთვის არის არაპერფორმანსიული (მოდის ობიექტი), ამიტომ მიღებული ერეის მხოლოდ ერთხელ ხდება ობიექტად გარდაქმნა (თავიდანვე), რაც პერფორმანსს ბევრად აჩქარებს ყოველ ჯერზე ერეის ელემენტში ძებნასთან შედარებით.
- პროექტი იყენებს tailwind და shadcn/ui კომპონენტებს

### ტესტების გაშვება:

     npm run test

<hr>

The project uses:

- Next.js 15.2.3
- CoinCap API
- Node.js v20.10.0
- npm v10.2.3.

After cloning the repository, run:

1.  `npm install`
2.  `npm run dev`

### Architectural Decisions:

- The project uses WebSockets to update information in real-time. If the socket fails, data will be automatically fetched every minute.
- I use React Query for caching, enabling fast retrieval of the same data, reusing previously fetched data in different parts of the app, and keeping it updated.
- Each asset page is static, generated as an HTML file at build time for better performance. The data updates every hour—I know this isn’t ideal for a trading chart, but since this is for testing...
- On the homepage, data is fetched only once and then updated via WebSockets to ensure users always have the latest information.
- Asset data is initially received as an array, but since updating an array for WebSocket updates is inefficient (as data comes in object format), the array is converted into an object only once. This significantly improves performance compared to searching through an array every time.
- The project uses Tailwind CSS and ShadCN/UI components.

### run tests:

     `npm run test`
