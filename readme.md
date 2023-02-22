## Task description
Here you can describe what tasks you decided to solve.
> Jeg bestemte meg for å lage en nettside som kunne representere data gitt av APIen dere hadde.
> Målet var blant annet: representer data av forbruk, representer data av leverandører og foreslå en plan / leverandør basert på forbruker data.

## How to run
>> Requirements: Node.js Angular/cli 
> 1. Download node.js at https://nodejs.org/en/download/
> 2. run "npm install -g @angular/cli" 
> 3. open terminal in backend folder
> 4. run "npm install"
> 5. run "nodemon start" or "node index.js" to start server
> 6. open terminal in frontend folder
> 7. "run npm install"
> 8. "run ng serve -o" to host website
> 9. if the website didn't open on it's own, open localhost:4200 in your browser

## Comments
Det første som burde nevnes er at jeg la til flere leverandører i APIen. Dette var for å få mer data å sammenligne med for å 
lage positive og negative sider med hver leverandør, i tillegg for å kunne faktisk gi flere muligheter ved anbefaling.

Consumption tab:
> Consumption tab begynner med å vise data tatt fra APIen i forskjellige format
> Gjennomsnittlig time forbruk på en gitt dato (grønn)
> > Når du trykker på den grønne grafen vil det poppe opp noen linjer med tekst over grafen som formidler gjennomsnittlig total forbruk pr. dag 
> > og gjennomsnittlig timeforbruk hver dag.
> Gjennomsnittlig forbruk basert på klokkeslett (blå)
> > Når du trykker på den blå grafen vil det poppe opp hvilke periode du har høyest og lavest forbruk
> Gjennomsnittlig time forbruk på dag av uken
> > Når du trykker på den røde grafen vil det poppe opp hvilke dager du bruker mest / minst.

Under alle sammen vil du få opp top 3 høyeste og laveste forbruks periodene

Providers tab:
> Alle forskjellige leverandører vil bli vist frem på denne siden i rekkefølgen de har i APIen.
> Det blir presentert en kort oppsummering av model / monthly fee / price / period
> Og en kort dynamisk tekst for hver som forklarer hva modellen går ut på (slik jeg forstod dem).

Best Options tab:
> I denne tabben vil du bli presentert med de beste mulighetene for hver prismodell.
> Hvilken som er valgt er i bunn og grunn basert på lavest mulig månedspris.
> I tillegg vil du få en anbefaling på hvilken som er best for deg. 
> Denne anbefalingen vil prioritere spot-hourly > spot-monthly > variabel > fixed 
> I tilfellet at alle 4 modellene har lik pris

> Et valg jeg føler at jeg må forsvare er spot-hourly/monthly sin upwards / downwards trend. 
> Siden slik jeg forstod spot-pris etter å ha lest på det for første gang når jeg kom så langt i oppgaven
> var at det jeg hadde tilgang til i APIen ville være urealistisk i form av statisk spotpris.
> Jeg bestemte meg derfor for å bruke den som en base, og presentere "best/worst" case scenario i formen av en 
> 1% endring hver dag i tilfellet av spot-hourly og 10% endring pr. mnd i spot-monthly
