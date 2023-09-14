This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## World Cup Fantasy

Web aplikacija se sastoji iz 2 projekta. 
1. NextJs - full stack projekat
2. socket-express - express server koji koristi socket.io za komunikaciju sa frontendom preko redis pub/sub-a

Pokretanje - prvo pokrenuti socket, zatim nextjs aplikaciju:

```bash
prvo: 
world-cup-fantasy > npm install
zatim:
world-cup-fantasy/socket-express > npm install

Pokretanje socketa:
world-cup-fantasy/socket-express > npm start - port treba biti 8080

Pokretanje same aplikacije:
world-cup-fantasy > npm run dev - port treba biti 3000
```

Otvoriti [http://localhost:3000](http://localhost:3000)

## API routes
U Nextu se rutiranje radi pomocu foldera, tako da se zapravi u api folderu nalazi backend aplikacije, par primera:
```
Folderi: app/api/users/route.ts - API endpoint je: localhost:3000/api/users
Folderi: app/api/users/[id]/route.ts - API endpoint je: localhost:3000/api/users/{USERID}
Folderi: app/api/users/[...credentials]/route.ts - API endpoint je: localhost:3000/api/users/{USERID}/{USERPASSWORD}
```
Ovo takodje vazi i za frontend, s tim sto je frontend sve sto je van api foldera.
Ukoliko se neke komponente nalaze u folderu (imeFoldera), ta putanja se ignorise.
Recimo ukoliko postoji:
```
app/(components)/header/page.tsx - Ne postoji endpoint na frontu za tu putanju
```

## Funkcionalnost
Prvo je potrebno ulogovati se ili napraviti nalog.
Test nalog: username:nsretkovic2 password: nikola
Nakon toga se na pocetnoj strani otvara fudbalski teren.
Klikom na karticu, u zavisnosti od pozicije, sa strane se preko relacija pribavljaju igraci koji mogu igrati tu poziciju. Postoje 4 pozicije: Goalkeeper, Defender, Midfielder i Striker
Pomocu neo4j relacija se igraci mogu filtrirati po ratingu, naciji i ceni, dok je pozicija staticka i zavisi od toga na koju karticu je kliknuto.
### Admin dashboard
Radi demonstracije, svaki korisnik moze otvoriti Admin Panel klikom na dugme na headeru. Tamo moze izabrati Player Dashboard, Tournament Maker, Cache Dashboard
####Players Dashboard
Ovde je moguce po naciji pretrazivati igrace, a zatim ili kreirati novog igraca za izabranu naciju ili menjati/brisati pronadjene igrace.
####Tournament Maker
Ovde je moguce kreirati Limited Time turnir. 
Kada se turnir kreira, na headeru se pojavljuje dugme koje vodi na turnir. Na dugmetu je timer koji odbrojava preostalo vreme za odigravanje turnira. Zamisljeno je da korisnik bude u aplikaciji i da kada admin kreira turnir, on instant dobije dugme na headeru. Neke informacije o turniru se kesiraju na express serveru tako da, ukoliko korisnik nije u tom trenutku u aplikaciji, kada se kasnije prikljuci, ako vreme nije isteklo, socket salje poruku o turniru sa preostalim vremenom.
Odigravanje turnira je, radi demonstracije, prosto generisanje rezultata na osnovu prosecnog rejtinga sastavljenog tima.
####Cache dashboard 
Posto se nacije koje su ucestvovale na svetskom prvenstvu u Kataru staticne-ne menjaju se, one su kesirane na redisu. Bilo gde imamo filter pomocu nacija, prvo se pokusa citanje iz cache-a (redisa), a zatim kao fallback se kontaktira neo4j.
U samom cache dashboardu imamo 3 dugmeta, Get Cache - koje vraca kesirane nacije (ukoliko ih ima). Revalidate cache - uzima sve nacije iz neo4j-a i kesira ih u redis. Delete Cache - brisanje.