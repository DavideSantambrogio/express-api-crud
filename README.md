Esercizio
Iniziamo a creare le API per il nostro blog. 
- [x] Iniziate con un nuovo progetto Express + Prisma.
- [x] Potete utilizzare lo schema Prisma che avete creato nell'esercizio di ieri.
- [x] Definizione degli endpoint
Vi chiediamo di definire i seguenti endpoint:
- [x] POST /posts per creare un nuovo post.
- [x] GET /posts/:slug per recuperare un post utilizzando il suo slug.
- [x] GET /posts per recuperare tutti i post presenti nel database, con la possibilità di filtrare per:
- [x] Post pubblicati.
- [] Post che contengono una determinata parola nel titolo o nel contenuto.
- [x] PUT /posts/:slug per aggiornare un post.
- [x] DELETE /posts/:slug per eliminare un post.
BONUS:
- [x] Implementare la paginazione.
- [x] Gestire gli errori, restituendo uno stato HTTP 404 e un messaggio di errore, nel caso in cui una rotta non sia stata trovata.
- [x] Gestire gli errori, restituendo uno stato HTTP 500 e un messaggio di errore, nel caso in cui venga sollevata un'eccezione dal Prisma Client.