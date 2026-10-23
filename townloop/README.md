# TownLoop

A neighbourhood marketplace for Sime Darby Property townships, built for the Sime Darby Property University Hackathon 2026 ("Township of Tomorrow").

Next.js 16, React 19, Tailwind CSS 4. Everything runs in the browser with demo data, so no backend or API keys are needed.

## Run it

```
npm install
npm run dev
```

Then open http://localhost:3000.

## Deploy to GitHub Pages

The live demo is a static copy in the `demo` folder at the repo root, served by GitHub Pages at https://rafiarsya07.github.io/Sime-Darby-Hackathon/demo/

After changing the app:

```
npm run build:pages
```

That rebuilds `../demo`. Commit and push, and Pages updates in a minute or two. Detail pages use `?id=` links (for example `/item/?id=washer`) so every listing, post and booking works without a server.

## The three tiers and Eco points

| Tier | What it is | Who earns points |
| --- | --- | --- |
| Rent | Items and spaces from neighbours (jet washer, party tent, blazer, driveway, SDP BBQ pit) | Renter earns the most, owner earns a little |
| Gigs | Small jobs from neighbours (lawn, cooking, pets, tuition, IT help) | Customer earns the most, helper earns a little |
| Vendors | Local and outside vetted businesses (aircond, solar, gutters, pest, plumbing), with street group buys | Customer only. Vendors get a ranking boost on Home instead |

Eco points are the bonus tier: 50 points is about RM1. Points land 24 hours after a booking is done, so either side can report a problem first. The full table is on Me, Eco points.

## Chat policy

Nobody can message anyone directly. A request comes first:

1. Someone books a listing, or answers a post with "Request to chat".
2. The other person sees their profile, what they share, ratings and previous work on the Me page.
3. Only when they accept does TownLoop open WhatsApp between the two. In this demo that is a WhatsApp deep link. In the live version the WhatsApp Business API introduces both sides.

## Demo story

Sign in as any of the three demo residents. Switch person from the Me page to see the other side.

1. **Tan** opens Me. Pak Rahman and Aiman answered his lawn post. He checks Pak Rahman's profile and taps "Accept and open WhatsApp". Aiman is declined automatically.
2. In Bookings, Tan confirms the lawn job is done, taps "Skip the 24 hours" and sees his points.
3. Tan opens the jet washer booking, scans Siti's code, then the demo bar returns it. Deposit released, points paid.
4. On Home, Vendors tab: the demand forecast card (AI preview, not live yet) and the aircond street group buy. Tan joins, the demo bar fills the group, and everyone earns 50 extra points.
5. Tan posts "Party blazer for a wedding" and lists a garden hose. First listing earns 100 points.
6. **Siti** sees Farid's request for her jet washer on Me, accepts, and gets a QR code for pick up.
7. **Pak Rahman** answers Priya's blazer post with "Request to chat".
8. Me, Eco points: redeem a BBQ pit slot or a dining voucher.

"Reset demo data" on Me puts everything back.

## Where things live

- `app/(app)/home` Carousell style feed with For you, Rent, Gigs, Vendors and Posts
- `app/(app)/items/[id]` listing detail and booking request
- `app/(app)/posts` wanted posts, new post, post detail with incoming requests
- `app/(app)/list` lend an item, offer a service, post a request, vendor sign up (coming soon)
- `app/(app)/bookings` booking list and detail (QR hand over, 24 hour window, reviews)
- `app/(app)/me` requests for you, your listings and posts, demo switcher, Eco points
- `app/(app)/people/[id]` resident and vendor profiles
- `lib/points.ts` the Eco points rules
- `lib/data.ts` demo residents, vendors, listings and posts
- `lib/store.tsx` demo state, saved in the browser
