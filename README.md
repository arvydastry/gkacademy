# GK Academy: mokymų akademijos svetainės demo

Statinė HTML/CSS/JS demonstracinė versija naujai **GK Academy** (gkacademy.lt, Grožio kultas, MB) svetainei. GK Academy yra grožio mokymų akademija Vilniuje: ilgalaikis makiažas, blakstienos, antakiai, depiliacija, masažas, plaukai, makiažas ir kiti mokymai, iš viso 37 programos.

Galutinė platforma: **WordPress + WooCommerce + XStore** (Elementor). Šiame etape sukurti du puslapių tipai: **pradžios puslapis** ir **mokymų programos puslapis** (trys programos iš vieno šablono). Kiti puslapiai bus kuriami, jei klientas patvirtins projektą.

Puslapiai pažymėti `noindex, nofollow`. Prieš tikrą paleidimą žymą išimti.

## Peržiūra

Gyva versija: https://arvydastry.github.io/gkacademy/ (GitHub Pages iš šakos `main`; atsinaujina po kiekvieno įkėlimo į saugyklą).

Vietoje:

```bash
python3 serve.py
```

Tada naršyklėje atidaryti http://localhost:8191. Puslapiai atsidaro ir tiesiai iš failų, tik „YouTube“ vaizdo įrašas tada gali nepasileisti.

- `?static=1` adreso gale išjungia visą judesį (patogu ekrano nuotraukoms). Tas pats įvyksta, kai lankytojo sistemoje įjungta „mažiau judesio“.
- Be „JavaScript“ puslapiai lieka perskaitomi: visas tekstas matomas, nuotraukos spalvotos, katalogas ir tvarkaraštis rodomi visi, registracijos blokas rodo numatytąjį pasirinkimą.

## Puslapiai

| Failas | Kas tai |
|---|---|
| `index.html` | Pradžios puslapis: hero su tikra kliento nuotrauka ir auksine linija nuo žodžio „čia“; greitoji paieška (sritis, mėnuo, formatas); faktų juosta; devynių sričių juosta; tamsi scena „Artimiausi mokymai“ su tikru tvarkaraščiu ir laisvomis vietomis; visų 37 programų katalogas su filtrais; akademija ir skaičiai; finansavimas; kelias nuo registracijos iki diplomo; galerija ir vaizdo pristatymas; atsiliepimai; dažni klausimai; kontaktų forma |
| `mokymai-ilgalaikis-makiazas.html` | Mokymų puslapis: ilgalaikio makiažo mokymai (antakiai, lūpos, akys), 3–6 dienos, 1 200–2 900 € |
| `mokymai-antakiu-dizainas.html` | Mokymų puslapis: antakių dizainas, architektūra ir laminavimas, 1–2 dienos, 280–600 € |
| `mokymai-makiazas-sau.html` | Mokymų puslapis: makiažas sau, 3 valandos, 100–150 € |

Trys mokymų puslapiai parinkti taip, kad šablonas būtų išbandytas su skirtingomis programomis: sudėtinga kelių dienų profesine (keturios trukmės, du formatai), trumpa profesine su daug datų ir trumpais mokymais sau.

Visuose puslapiuose veikia: mega meniu su visomis programomis, paieška tarp programų, įsimintos programos (širdelė), rezervacijų krepšelis (šoninis langas, išsaugomas naršyklėje), užklausos langas, vaizdo įrašo langas, mobilus meniu ir slenkant pasislepianti antraštė. Mokymų puslapyje papildomai: galerija, registracijos blokas (formatas, programa, data, avansas arba visa suma), programos skirtukai, informacijos skiltys ir lipni registracijos juosta. Data perduodama nuoroda: `mokymai-antakiu-dizainas.html?data=2026-12-01`; sritis: `index.html?sritis=pmu#katalogas`. Nuorodos į dar nesukurtus puslapius (kitos programos, paskyra, apmokėjimas, anglų kalba, taisyklės) rodo pranešimą.

## Kaip demo atsako į kliento užklausą

| Kliento lūkestis | Kur tai matyti demo |
|---|---|
| Premium, ne šabloninis dizainas | Kryptis „Linija ir pigmentas“ (žr. žemiau): tapatybė išvesta iš akademijos amato ir logotipo, o ne iš paruošto šablono |
| Mokymų katalogas su filtrais, kainomis, datomis | Pradžios puslapio katalogas: 37 programos, filtrai pagal sritį, trukmę, formatą, paskirtį ir mėnesį, rikiavimas pagal kainą ar datą |
| Atskiri programų puslapiai pagal vieningą šabloną | `src/templates/mokymas.html`: vienas šablonas, turinys iš duomenų failo |
| Registracija į grupinius mokymus, laisvų vietų valdymas | Tvarkaraštis ir registracijos blokas: datos, laisvų vietų taškai, „Liko 1 vieta“, laukiančiųjų sąrašas, kai vietų nebėra |
| Individualių datų užklausos | Pasirinkimas „Kita data“ ir formatas „Individualūs“ atidaro užklausos formą su programos pavadinimu |
| Avansas arba visa suma | Registracijos bloko žingsnis „Mokėjimas“, sumos krepšelyje („Mokėti dabar“ ir „Likusi suma“) |
| Dvi kalbos | Perjungiklis LT / EN antraštėje (anglų versija demo nekuriama) |
| Mobilioji versija | Visi blokai perdėlioti telefonui: sukraunamos tvarkaraščio eilutės, slenkama sričių juosta, lipni registracijos juosta |
| SEO ir DI paieška | Kiekviena programa turi savo puslapį, `Course` struktūrinius duomenis (kainos, datos, kvalifikacija), DUK bloką; senų adresų sąrašas nukreipimams yra duomenų faile |
| Savarankiškas administravimas | Visas turinys (programos, kainos, datos, tekstai) demo yra viename duomenų faile; WooCommerce tai atitiks prekės ir jų variantai |

## Dizaino kryptis: „Linija ir pigmentas“

Išeities taškas: viskas, ko moko GK Academy, susideda iš dviejų veiksmų. Pirmiausia tiksliai nubrėžiama linija (antakio plaukelis, akių kontūras, lūpų kontūras, tatuiruotės linija), tada ji užpildoma pigmentu. Svetainė sudėta iš tų pačių dviejų dalykų.

- **Linija.** Plonos skiriamosios linijos vietoje kortelių su šešėliais, plona antraščių antikva, kontūriniai mygtukai ir laukai. Auksinė linija prasideda nuo taško po žodžio „čia“ (akademijos šūkis „Tavo grožio kelias prasideda čia“), nueina už nuotraukų ir veda prie paieškos. Ta pati linija jungia kelio žingsnius ir registracijos bloko žingsnius.
- **Pigmentas.** Nuotraukos iš pradžių nespalvotos ir nusispalvina, kai pasirodo ekrane arba kai užvedama pelė. Mygtukai ir programų kortelės užsipildo juodai nuo pelės taško. Pasirinktas variantas registracijos bloke užsipildo juodai. Laisvos vietos rodomos taškais: užpildytas taškas reiškia užimtą vietą, kontūras reiškia laisvą.
- **Viena akcentinė spalva: logotipo drugelio auksinė `#D2AC67`** (šviesiame fone tamsesnė `#A8843F`). Taisyklė: auksinė naudojama tik linijoms. Užpildas visada juodas arba baltas. Fonai balti ir šaltai pilki, be smėlio ir rudų atspalvių, nes šiltus tonus atneša pačios nuotraukos.
- **Šriftai.** Noto Serif Display (kintamas; antraštėms naudojamas plonas 300 storis ir susiaurintas plotis, kad ilgi lietuviški pavadinimai tilptų dideliu dydžiu) ir Hanken Grotesk tekstui bei sąsajai. Abu laikomi `assets/fonts/` (OFL licencija), apkarpyti iki lotyniškų ir lietuviškų rašmenų, po vieną failą šeimai.
- **Viena tamsi scena puslapyje.** Pradžios puslapyje tai tvarkaraštis, mokymų puslapyje tai programa arba technikos. Scena įslenka su paraštėmis ir išsiplečia iki ekrano kraštų. Visa kita šviesu.
- **Judesys.** Hero antraštės eilutės iškyla, linija nusibrėžia, nuotraukos slenka skirtingu greičiu (paralaksas); faktų juosta greitėja slenkant; sričių juostą galima tempti pele, o nuotraukos joje juda lėčiau nei kortelės; katalogo kairėje esanti nuotrauka keičiasi pagal užvestą programą; teiginio žodžiai „nusidažo“ slenkant; kelio linija brėžiasi ir pasiektas taškas užsipildo.
- **Nuotraukos** visos kliento: 37 nuotraukos iš gkacademy.lt galerijos ir puslapio „Apie mus“. Iš rezultatų nuotraukų nukirpti auksiniai rėmeliai ir vandenženkliai.
- **Ikonos:** Phosphor (Light), tik sąsajai (paieška, krepšelis, laikrodis, kalendorius).
- Nėra išgalvotų atsiliepimų, skaičių, ženklelių ar partnerių logotipų. Nėra antraštinių etikečių virš antraščių ir sekcijų numeracijos.

## Kas tikra, o kas demo

**Tikra (iš gkacademy.lt, nuskaityta 2026-11-16):** 37 programų pavadinimai, trukmės, kainos ir formatai; tvarkaraščio datos (puslapis „Tvarkaraštis“, 2026 m. lapkritis ir gruodis); trijų mokymų puslapių tekstai (aprašymas, tikslas, nauda, programa, praktika, kvalifikacija, kas įskaičiuota, startinis rinkinys); finansavimo sąlygos (Užimtumo tarnyba ir „Kursuok.lt“); teiginiai apie akademiją (nuo 2009 m., 80–90 % praktikos, trys kalbos, išsimokėtinai, AIKOS); kontaktai; nuotraukos; logotipas; „YouTube“ vaizdo pristatymas; keturi atsiliepimai (tikros „Facebook“ rekomendacijos iš puslapio „Atsiliepimai“).

**Demo arba laikinas turinys:**

- Laisvų vietų skaičiai (taškai ir „Liko 1 vieta“) yra sugeneruoti, ne tikri. Trijų sukurtų programų skaičiai nurodyti `site.json` („seats_demo“), kitų išvedami iš programos ir datos.
- Avanso dydis 20 % yra prielaida.
- Krepšelis, formos, laukiančiųjų sąrašas ir apmokėjimas nieko nesiunčia.
- Grupės dydis: ten, kur šaltinyje nenurodytas, demo skaičiuoja dvi vietas. Individualių mokymų datoms rodoma viena vieta.
- Kai programa turi kelias trukmes, datos rodomos kaip „Pradžia gruodžio 7 d.“: iš tvarkaraščio neaišku, kuriai trukmei skirta kiekviena data.
- Devynios sritys (kategorijos) yra mano siūlomas suskirstymas; dabartinėje svetainėje programos nesugrupuotos.
- Kelio žingsnis „Rezervuojate vietą“ aprašo būsimą registraciją internetu, ne dabartinę tvarką.
- Dažnų klausimų atsakymai surašyti iš teiginių, kurie dabartinėje svetainėje išbarstyti po programų puslapius ir tvarkaraštį.
- Tvarkaraštis rodo tik būsimas datas pagal peržiūros dieną. Kai praeis paskutinė gruodžio data, sąrašas liks tuščias ir bus rodomas kvietimas derinti datą individualiai.

## Tekstų pakeitimai, palyginti su kliento šaltiniais

Kliento tekstai palikti, taisytos rašybos ir skyrybos klaidos, kreipinys „Jūs“ rašomas mažąja raide. Sąmoningi pakeitimai:

1. **Teiginiai „vieninteliai“ ir „unikalūs“ neperkelti.** Šaltiniuose yra „vienintelė akademija pasaulyje“, „esame vieninteliai Lietuvoje“, „unikalūs Lietuvoje“. Reklamoje tokie teiginiai turi būti pagrįsti, todėl sprendimas paliktas klientui (žr. klausimus žemiau).
2. **Diplomų pripažinimas.** Puslapyje „Apie mus“ rašoma, kad sertifikatai ir diplomai „patvirtinti LR Švietimo ir mokslo ministerijos ir galioja visame pasaulyje“. Demo naudoja atsargesnę formuluotę iš programų puslapių: programa įtraukta į AIKOS sistemą, LR Suaugusiųjų švietimo registrą; įteikiamas tarptautinis diplomas anglų kalba, pripažįstamas ne tik Lietuvoje, bet ir užsienyje.
3. **Programų pavadinimai suvienodinti.** Vietoje didžiųjų raidžių ir šauktukų („ILGALAIKIO (PERMANENTINIO) MAKIAŽO MOKYMAI“, „NAUJA 2027 metų PROGRAMA!“) pavadinimai rašomi įprastai, svetimi pavadinimai kabutėse („New Trend“, „Kobido“, „MasterClass“). „Nauja 2027 metų programa“ antakių dizaino puslapyje palikta kaip ženklelis ant nuotraukos.
4. **Ilgalaikio makiažo puslapis.** Technikos „LIPSTIC“ pavadinimas pataisytas į „LIPSTICK“. Technikos sugrupuotos pagal zonas (antakiai, lūpos, akys, šalinimas). Išimtas sakinys „Esame vieninteliai Lietuvoje organizuojantys…“. Dėstytojos aprašyme išimta „kad studentams būtų teikiami novatoriškiausi, aukščiausio lygio mokymai“.
5. **Antakių dizaino puslapis.** Keturiasdešimt programos punktų sugrupuoti į penkias temas (pagrindai, dažymas, architektūra, laminavimas, korekcija ir klientas); keli gretimi punktai sujungti, „henna“ pakeista į „chna“. Pastraipa „Tik šiuose mokymuose…“ perrašyta be žodžio „unikalūs“. Šaltinyje vienoje vietoje rašoma „3–4 modeliai“, kitoje „dviem modeliams“: demo praktikos aprašyme palikta „dviem modeliams“, o kitur parašyta tik „modeliais pasirūpiname mes“.
6. **Makiažo sau puslapis.** Dvylika programos punktų sugrupuoti į tris temas. Sutrumpintas sakinys apie pasitikėjimą savimi.
7. **Hero ir akademijos tekstai.** Sudėti iš puslapio „Apie mus“ sakinių. Teiginys „Mes tikime, kad grožis – tai ne tik estetika, bet ir kūryba, drąsa bei meistrystė“ yra pažodinis.
8. **Atsiliepimai.** Tekstai sutrumpinti, pataisyta skyryba ir trūkstamos nosinės; turinys nekeistas. Rodomas vardas ir pavardės raidė.
9. **Šalinimo programos.** Dabartinėje svetainėje yra du panašūs puslapiai. Demo juos atskiria pavadinimais: „šalinimas lazeriu“ ir „šalinimas removeriais“.

## Įgyvendinimas XStore temoje

Kiekviena sekcija šablonuose (`src/templates/`) turi komentarą su XStore arba Elementor atitikmeniu. Valdiklių pavadinimai ir registracijos vardai patikrinti pagal „XStore Core“ (ET Core) 5.7.7 įskiepio kodą. „Savaime“ reiškia, kad tai padaro pats valdiklis; „papildomai“ reiškia, kad reikia child theme CSS arba scenarijaus.

### Duomenų modelis

Kiekviena mokymų programa yra WooCommerce **kintama prekė** (variable product):

| Demo | WooCommerce |
|---|---|
| Sritis (9) | Prekės kategorija |
| Formatas (grupiniai, individualūs) | Atributas, naudojamas variantams |
| Programa arba trukmė (3, 4, 5, 6 dienos) | Atributas, naudojamas variantams; nuo jo priklauso kaina |
| Data | Atributas, naudojamas variantams; varianto likutis (stock) = laisvos vietos |
| „Kita data“ / individualūs mokymai | Užklausa per „Request A Quote“ arba variantas be likučio valdymo |
| Kvalifikacija, kam skirta, trukmė kortelėje | Prekės atributai arba papildomi laukai (ACF) |
| Technikos ir programos temos | Pasikartojantis prekės laukas (ACF „Repeater“), išvedamas vienu šablonu |
| Avansas arba visa suma | Avanso įskiepis (žr. rizikas) |

### Pradžios puslapis ir bendros dalys

| Demo blokas | XStore / Elementor atitikmuo | Pastabos |
|---|---|---|
| Viršutinė juosta (kalbos, telefonas, el. paštas) | Header Builder (Elementor), viršutinis konteineris: Text Editor + XStore „Icon List“ (`etheme_icon_list`) + kalbų perjungiklis | Perjungiklį duoda daugiakalbystės įskiepis (WPML arba „Polylang“). |
| Antraštė | Header Builder: „Site Logo“, „Nav Menu“, „Mega Menu“ (`theme-etheme_mega_menu`), „Popup Search“ arba „Header Ajax Search“, „My Account“, „Wishlist“, „Shopping Cart“, „Mobile Menu“; konteinerio sticky tipas „smart“ | Reikia „PRO Elements“ arba „Elementor Pro“. XStore lipni antraštė veikia per JS, todėl demo slėpimo scenarijus neperkeliamas. |
| Mega meniu su visomis programomis | „Mega Menu“ turinys: „Static Block“ (`etheme_static_block`) su „Menu List“ (`et_menu_list`) kiekvienai sričiai | Keturių stulpelių išdėstymas: Elementor Container. |
| Hero su linija | Elementor Container (2 stulpeliai): Heading + Text Editor + 2× XStore „Text Button“ (`text_button`); dešinėje 2× Image su „XStore Parallax“ | Papildomai: auksinė linija (SVG, kurią pagal antraštės ir nuotraukų vietą apskaičiuoja `home.js`), eilučių iškilimas, nuotraukų nusispalvinimas. Hero nuotraukai grąžinti `preload` ir `fetchpriority`, išimti ją iš lazy-load. |
| Greitoji paieška po hero | XStore „Horizontal Filters“ (`etheme_sidebar_horizontal`) arba „Product Filters“ (`etheme_product_filters`), nukreipti į katalogo puslapį | Demo forma tik perduoda pasirinkimus katalogo filtrams tame pačiame puslapyje. |
| Faktų juosta | XStore „Marquee“ (`etheme_marquee`) | Savaime: begalinė juosta, sustojimas užvedus. Papildomai: pagreitėjimas pagal slinkimo greitį, auksinis brūkšnys tarp teiginių. |
| Sričių juosta | XStore „Product Categories“ (`etheme_categories`) karuselės režimu arba „Horizontal Scroll“ (`etheme_horizontal_scroll`) | Savaime: kategorijos nuotrauka, pavadinimas, prekių skaičius, rodyklės. Papildomai: „nuo … €“ eilutė, nusispalvinimas užvedus, eigos linija, tempimas pele. |
| Tamsi scena „Artimiausi mokymai“ | Elementor Container (tamsus fonas) + XStore „Products List“ (`etheme_product_list`) + „Advanced Stock Status“ (laisvos vietos) + „Waitlist“ (kai vietų nebėra) | Variantų sąrašo pagal datą XStore savaime neišveda (žr. rizikas): reikia trumpo child theme kodo. Datos lentelės išvaizda, vietų taškai ir scenos išsiplėtimas: child theme. |
| Katalogas su filtrais | XStore „Products Grid“ (`etheme_product_grid`) + „Product Filters“ arba „Horizontal Filters“; puslapiavimas „Load more“ | Savaime: užklausa, filtrai pagal kategoriją ir atributus, rikiavimas, kaina, „Wishlist“ širdelė. Papildomai: tekstinė kortelė be nuotraukos (žr. rizikas), užsipildymas nuo pelės taško, artimiausia data kortelėje, lipni srities nuotrauka kairėje. |
| Akademija: teiginys, nuotraukos, skaičiai | Elementor Heading + Text Editor + 2× Image su „XStore Parallax“; skaičiai – Heading | Papildomai: teiginio žodžių ryškėjimas slenkant (`home.js`). Elementor „Counter“ netinka skaičiui „80–90 %“. |
| Finansavimas | Elementor Container (2 stulpeliai): Heading + Text Editor + XStore „Icon List“ + numeruotas sąrašas + XStore „Text Button“ | Telefone galima keisti į XStore „Tabs“. Mygtukas atidaro užklausos langą. |
| Kelias nuo registracijos iki diplomo | XStore „Horizontal Timeline“ (`etheme_horizontal_timeline`), telefone „Vertical Timeline“ | Papildomai: linija, kuri brėžiasi slenkant, ir taškų užsipildymas. |
| Galerija | Trys Elementor Container stulpeliai su Image valdikliais ir „XStore Parallax“ | XStore „Gallery“ (`etheme_gallery`) tinka, jei skirtingo stulpelių greičio nereikia. |
| Vaizdo pristatymas | XStore „Modal Popup“ (`etheme_modal_popup`) su Elementor „Video“ valdikliu (įjungti „Privacy Mode“) | Demo įrašą atidaro mygtukas po galerija ir ikona poraštėje. |
| Atsiliepimai | XStore „Testimonials“ (`testimonials`) tinklelio išdėstymu | Kitas kelias: „Google“ arba „Facebook“ atsiliepimų įskiepis, kad atsiliepimai atsinaujintų patys. |
| Dažni klausimai | Elementor „Accordion“ + DUK struktūriniai duomenys (SEO įskiepio DUK blokas) | Lipnus kairysis stulpelis: XStore „Sticky Column“. |
| Kontaktų forma | XStore „Contact Form 7“ valdiklis (`et-contact-form-7`) arba Elementor forma („PRO Elements“) + XStore „Icon List“ + Image | Formos įskiepyje atkurti lietuviškus klaidų tekstus, sutikimo langelį ir sėkmės pranešimą. |
| Poraštė | Footer Builder (Elementor): „Site Logo“, Text Editor, „Menu List“, XStore „Icon List“, „Social Links“ (`etheme-follow`) | |
| Krepšelio šoninis langas | Header Builder „Shopping Cart“ valdiklis, off-canvas | Demo krepšelis yra maketas ir neperkeliamas. Eilutes „Mokėti dabar“ ir „Likusi suma“ duoda avanso įskiepis. |
| Paieška | Header Builder „Popup Search“ arba „Header Ajax Search“ | Savaime: Ajax rezultatai su kaina. |
| Mobilus meniu | Header Builder „Mobile Menu“ valdiklis (off-canvas) | Demo išvaizda (juodas skydelis, didelės nuorodos): valdiklio stiliaus nustatymai ir CSS. |
| Užklausos langas | XStore „Modal Popup“ su „Contact Form 7“ arba mokymų puslapyje „Request A Quote“ | Formoje perduoti programos pavadinimą (paslėptas laukas). |

### Mokymų puslapis (Single Product Builder)

| Demo blokas | XStore / Elementor atitikmuo | Pastabos |
|---|---|---|
| Kelias | „WooCommerce Breadcrumb“ (`woocommerce-etheme_breadcrumb`) | |
| Galerija | „Product Images“ (`woocommerce-product-etheme_product_images`): miniatiūros apačioje, lightbox | Lipnus stulpelis: XStore „Sticky Column“. Papildomai: nespalvotos miniatiūros, nusispalvinimas. |
| Pavadinimas, kvalifikacija, įžanga | „Title“, „Short Description“ | Kvalifikacijos eilutei valdiklio nėra: papildomas laukas arba pirma trumpo aprašymo eilutė. Ženklelis „Nauja programa“: prekės žyma arba laukas. |
| Registracijos blokas | „Add to Cart“ (`woocommerce-product-etheme_add_to_cart`) + XStore „Variation swatches“ (tipas „label“) + „Advanced Stock Status“ (`woocommerce-product-etheme_advanced_stock_status`) + „Waitlist“ (`woocommerce-product-etheme_waitlist`) | Savaime: variantų žymekliai, kainos keitimas, likutis, laukiančiųjų sąrašas. Papildomai: žingsnių linija, vietų taškai, datos su savaitės diena, suma „Mokėti dabar“. Avanso pasirinkimą įterpia avanso įskiepis. |
| „Kita data“, „Užduoti klausimą“ | „Request A Quote“ (`woocommerce-product-etheme_request_a_quote`) | Užklausos forma su programos pavadinimu. |
| Privalumų sąrašas po bloku | XStore „Icon List“ (`etheme_icon_list`) | Tekstai skiriasi pagal programą: prekės laukas. |
| Tamsi scena: technikos arba programa | Elementor Container produkto šablone + XStore „Tabs“ + Text Editor sąrašai + Image | Grupės saugomos prekės laukuose (ACF „Repeater“). Papildomai: nuotraukos keitimas perjungiant grupę. |
| Informacijos skiltys | „Single Product Tabs“ (`woocommerce-product-etheme_tabs`), tipas „accordion“ | Papildomi skirtukai (tikslas, nauda, praktika, diplomas, startinis rinkinys) iš prekės laukų; tušti skirtukai nerodomi. Kainų lentelė: variantų lentelė arba Text Editor. |
| Dėstytoja, mokymų vieta | Heading + Text Editor; Image + XStore „Icon List“ | Dėstytojoms galima sukurti atskirą įrašų tipą ir sieti su programomis. |
| Finansavimo juosta | Globalus Elementor šablonas, rodomas tik profesinėms programoms (XStore „Conditional Display“ arba „Display Conditions“) | |
| Kitos programos | „Related Products“ (`woocommerce-product-etheme_related`) arba „Cross-Sells Products“ | Demo programos parinktos rankomis. |
| Lipni registracijos juosta | „Sticky Cart“ (`woocommerce-product-etheme_sticky_cart`) | Pakeičia demo juostą. Demo papildomai rodo pasirinktą programą ir datą. |

### Funkcijos, kurių demo tik imituoja

| Funkcija | Kaip įgyvendinti | Pastabos |
|---|---|---|
| Laisvų vietų valdymas | WooCommerce varianto likutis; XStore „Advanced Stock Status“ ir „Waitlist“ | Administratorius datą prideda kaip naują variantą ir įrašo vietų skaičių. |
| Avansas arba visa suma | Avanso įskiepis, pavyzdžiui, „WooCommerce Deposits“ arba „YITH WooCommerce Deposits / Down Payments“ | Nepatikrinta su XStore variantų žymekliais ir „Sticky Cart“. |
| Patvirtinimai ir priminimai | WooCommerce laiškai (patvirtinimas) + automatizavimo įskiepis priminimui prieš mokymų datą | Priminimui reikia varianto datos lauko. Įskiepis nepasirinktas. |
| Mokėjimai | Lietuvos mokėjimų tarpininko įskiepis („Paysera“, „Montonio“, „MakeCommerce“ arba „Stripe“) | Pasirinkti su klientu; išsimokėtinai galimybė priklauso nuo tarpininko. |
| Dvi kalbos | WPML arba „Polylang“ su WooCommerce priedu | XStore suderinamumą su WPML deklaruoja 8theme; gyvai nepatikrinta. |
| SEO | SEO įskiepis („Rank Math“ arba „Yoast“), `Course` ir DUK struktūriniai duomenys, 301 nukreipimai iš senų adresų | Senų adresų sąrašas (37 programos) yra `src/data/site.json` lauke `old`. |
| Analitika | GA4 per „Google Tag Manager“, WooCommerce įvykiai (`view_item`, `add_to_cart`, `begin_checkout`, `purchase`), užklausos kaip `generate_lead`; „Google Search Console“ | |

### Rizikos, kurias reikia žinoti prieš perkeliant

1. **Data kaip variantas.** Kai programa turi du formatus, keturias trukmes ir kelias datas, variantų skaičius greitai auga (2 × 4 × 3 = 24 variantai vienai programai), o kiekvieną naują datą reikia įvesti kiekvienai trukmei. Prieš pradedant reikia nuspręsti: variantai (paprasčiausia, veikia su XStore valdikliais) arba rezervacijų ar renginių įskiepis (patogiau datoms, bet prasčiau dera su XStore prekės šablonu). Demo išvaizda tinka abiem atvejais.
2. **Tvarkaraštis pagal datą.** XStore „Products List“ rikiuoja prekes, ne variantus. Demo tvarkaraštis rodo po eilutę kiekvienai datai, todėl reikia child theme kodo, kuris surenka artimiausius variantus su likučiu.
3. **`position:sticky` XStore apvalkale neveikia.** Tema visą puslapį apgaubia `.template-container{position:relative;overflow:hidden}` (patikrinta ankstesniame projekte). Demo sticky naudoja katalogo nuotraukai, mokymų puslapio galerijai, DUK antraštei ir šoninei informacijai. Child theme reikia `.template-container{overflow:clip}` arba XStore „Sticky Column“.
4. **Avansas ir variantai.** Avanso įskiepis turi teisingai skaičiuoti sumą pasikeitus variantui ir rodyti likutį krepšelyje, laiškuose ir paskyroje. Tai reikia išbandyti prieš pasirenkant įskiepį.
5. **Tekstinė programos kortelė.** Demo katalogo kortelė neturi nuotraukos. „Products Grid“ valdiklio išdėstymai (numatytasis, „Booking“, „Light“, „Information mask“, „Overlay content on image“ ir kiti) visi rodo prekės nuotrauką, todėl tokiai kortelei reikia savo šablono child theme. Paprastesnis kelias: išdėstymas „Booking“ su nuotrauka, bet tada kiekvienai iš 37 programų reikės geros kokybės viršelio.
6. **Dvi juostos ekrano apačioje.** Naudoti tik XStore „Sticky Cart“, o demo juostą pašalinti. XStore „Mobile Panel“ naudoja tą patį ekrano kraštą: išjungti arba slėpti mokymų puslapyje.
7. **Scenarijų prijungimas.** Judesio kodui reikia: scenarijaus `<head>` dalyje, kuris nustato `js` ir `is-static` klases; SVG ikonų rinkinio; GSAP ir ScrollTrigger; `data-*` atributų. Elementor juos deda tik per XStore „Custom Attributes“ modulį arba „Elementor Pro“. XStore nuotraukas įkelia atidėtai, todėl ScrollTrigger reikia atnaujinti po nuotraukų įkėlimo.
8. **Šriftų pločio ašis.** Antraštės naudoja susiaurintą Noto Serif Display plotį ir tarpinius storius iš vieno kintamo failo. Temos nustatymuose to nėra: planuoti tipografiją per child theme CSS.
9. **Senos svetainės adresai.** Dabartinė svetainė veikia „Joomla“ sistemoje, adresai `/lt/mokymai/...`. Norint išsaugoti „Google“ pozicijas, kiekvienam senam adresui reikia 301 nukreipimo; dalis senų adresų turi skaitinį priešdėlį (`/lt/mokymai/332-baziniai-manikiuro-mokymai`).

XStore patikroje liko nepatvirtinta: ar temos nustatymuose yra prekės kortelės šablonas be nuotraukos ir ar kortelėje galima išvesti artimiausio varianto datą; kaip „Sticky Cart“ ir „Advanced Stock Status“ atrodo su trijų atributų variantais; ar „Request A Quote“ forma perduoda pasirinktą variantą; kaip „Waitlist“ veikia varianto lygiu.

## Ką reikia patvirtinti su klientu

1. **Teiginiai „vieninteliai Lietuvoje“ ir „vienintelė akademija pasaulyje“.** Ar klientas nori juos naudoti ir kuo jie pagrįsti?
2. **Diplomų pripažinimas.** Kuri formuluotė tiksli: „patvirtinti LR Švietimo ir mokslo ministerijos“, „įtraukta į AIKOS“, „tarptautinis diplomas“? Ar tai galioja visoms programoms, ar tik daliai?
3. **Kainos.** Visos kainos paimtos iš dabartinės svetainės 2026-11-16. Ar jos galioja? Kelios programos turi perbrauktą seną kainą (randų dermopigmentacija 2 000 → 1 500 €, „Drakoniukai“ 400 → 350 €): ar tai laikina akcija?
4. **Tvarkaraštis ir trukmės.** Tvarkaraštyje prie ilgalaikio makiažo nurodyta „gruodžio 7–11“ (penkios dienos), o programa turi 3, 4, 5 ir 6 dienų variantus. Kaip datos siejasi su trukmėmis?
5. **Grupių dydis.** Daugumoje programų nurodyta „tik 2 mokinių grupė“, kai kur 3, kai kur nenurodyta. Reikia tikslaus vietų skaičiaus kiekvienai programai.
6. **Individualūs mokymai tvarkaraštyje.** Dalis programų turi tik individualų formatą, bet jų datos yra tvarkaraštyje. Ar tai laisvi dėstytojos laikai vienai mokinei?
7. **Avansas.** Koks avanso dydis (procentas ar fiksuota suma), iki kada sumokama likusi suma, kokios atšaukimo ir grąžinimo sąlygos? Ar avansas taikomas ir pigiems mokymams (100–150 €)?
8. **Išsimokėtinai.** Dabartinėje svetainėje rašoma „visus mokymus galite įsigyti išsimokėtinai“. Per kokį tarpininką ir kokiomis sąlygomis?
9. **Mokėjimo būdai.** Kokį mokėjimų tarpininką klientas naudoja arba norėtų naudoti?
10. **Finansuojami mokymai.** Ar per Užimtumo tarnybą ir „Kursuok.lt“ finansuojamos visos programos, ar tik dalis? Ar tokios registracijos vyksta per svetainę, ar atskirai?
11. **Kalbos.** Mokymai vyksta lietuvių, anglų ir rusų kalbomis, o svetainei prašomos dvi kalbos (lietuvių ir anglų). Ar rusų kalbos svetainėje tikrai nereikia? Kainos kita kalba skiriasi: kaip jas rodyti?
12. **Sritys.** Ar tinka devynių sričių suskirstymas ir pavadinimai?
13. **Dėstytojos.** Reikia vardų, pavardžių, nuotraukų, trumpų aprašymų ir sutikimo. Šaltiniuose minimos Vaiva, Evelina, Natalija, Inga, Justina, Elmyra, Roberta; rašyba ne visur sutampa.
14. **Atsiliepimai.** Keturi rodomi atsiliepimai yra „Facebook“ rekomendacijos iš dabartinės svetainės. Ar turime autorių sutikimą? Ar klientas nori gyvo „Google“ arba „Facebook“ atsiliepimų valdiklio?
15. **Nuotraukos.** Visos paimtos iš dabartinės svetainės galerijos. Jose matyti mokinės, modeliai ir dėstytojos: reikia patvirtinti, kad jas galima naudoti naujoje svetainėje. Ar klientas turi profesionalių nuotraukų arba planuoja fotosesiją?
16. **Logotipas.** Demo naudoja 360 px pločio PNG iš dabartinės svetainės. Reikia vektorinio failo ir šviesaus varianto tamsiam fonui (demo jis pagamintas perdažius raides).
17. **Telefonai ir el. paštas.** Dabartinėje svetainėje nurodyti trys skirtingi telefono numeriai ir du el. pašto adresai. Demo rodo +370 676 87272 ir info@gkacademy.lt.
18. **El. parduotuvė.** groziokultas.lt demo lieka išorine nuoroda. Ar ją planuojama jungti prie naujos svetainės?
19. **Programų puslapių skirtumai.** Ne visos programos turi tas pačias skiltis (kvalifikacija, startinis rinkinys, diplomas). Šablonas tuščių skilčių nerodo, bet turinį reikės peržiūrėti kiekvienai programai.
20. **Šalinimo programos.** Ar „šalinimas lazeriu“ ir „šalinimas removeriais“ yra dvi atskiros programos?

## Kas nepatikrinta

- Tikrinta „Chrome“ naršyklėje: kompiuterio (1440 px) ir telefono (390 px) pločiai, režimas be judesio, mega meniu, paieška, rezervacija į krepšelį, programos skirtukai. „Safari“, „Firefox“, planšetės plotis ir tikras telefonas netikrinti.
- Naršymas klaviatūra ir ekrano skaitytuvu tikrintas tik iš dalies. Kontrastas ir prieinamumas pagal WCAG nematuoti.
- Greitaveika nematuota.
- Nuolat judančiai faktų juostai nėra pauzės mygtuko. Judesys išsijungia per sistemos nustatymą „mažiau judesio“ arba `?static=1`.
- XStore atitikmenys patikrinti pagal įskiepio kodą, bet ne gyvoje „WordPress“ svetainėje.

## Medija ir šaltiniai

- Tekstai, kainos, tvarkaraštis, finansavimo sąlygos: https://www.gkacademy.lt/lt/ (37 programų puslapiai, „Apie mus“, „Tvarkaraštis“, „Kontaktai“, „Atsiliepimai“), nuskaityta 2026-11-16.
- Nuotraukos (`assets/img/photos/`): gkacademy.lt galerijos albumai ir puslapis „Apie mus“. Failų pavadinimai rodo temą (`pmu-`, `dizainas-`, `makiazas-`, `akademija-` ir kt.). Stoko nuotraukų nėra.
- Logotipas (`assets/img/brand/`): `logo6.png` iš dabartinės svetainės; šviesus variantas, drugelio ženklas ir piktogramos pagaminti iš jo.
- Vaizdo įrašas: „YouTube“ `btZhNrubBYc` (iš dabartinio pradžios puslapio). Atidaromas lange per youtube-nocookie.com.
- Šriftai: Noto Serif Display ir Hanken Grotesk (SIL OFL, licencijos `assets/fonts/`). Ikonos: Phosphor (MIT, `src/icons/`). Judesys: GSAP 3 ir ScrollTrigger (`assets/js/vendor/`, standartinė nemokama licencija).

## Struktūra ir redagavimas

```
src/data/site.json      visas turinys: kontaktai, sritys, 37 programos, tvarkaraštis, trijų mokymų puslapių tekstai, DUK
src/templates/          base.html, index.html, mokymas.html ir bendros dalys (partials/)
src/icons/              Phosphor ikonos, iš kurių surenkamas įterptas SVG rinkinys
assets/css/             base.css (sistema, antraštė, sluoksniai, kortelė), home.css, course.css
assets/js/              core.js (meniu, krepšelis, paieška, langai, paralaksas), home.js, course.js
assets/img/             photos/ (kliento nuotraukos, po du dydžius), brand/ (logotipas)
build.py                surenka šakninius *.html (reikia Python 3 ir jinja2)
serve.py                vietinis peržiūros serveris
```

Redaguojami tik failai `src/` ir `assets/` kataloguose. Pakeitus šablonus ar `site.json`:

```bash
python3 build.py
```

Nauja programa su savo puslapiu: `site.json` sąraše „courses“ programai pridėti lauką `page`, o skiltyje „details“ aprašyti jos turinį pagal esamų trijų pavyzdį. Tvarkaraščio datos rašomos skiltyje „schedule“ (`2026-12-07` arba `2026-12-07/2026-12-11`); praėjusios datos į puslapius nepatenka.
