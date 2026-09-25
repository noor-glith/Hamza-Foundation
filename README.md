# Hamza Foundation Hospital, Samanabad (multi-page website)

Independent website project for Hamza Foundation Hospital (Amin Hayat Memorial Medical Center),
Al-Mumtaz Road, Pakki Thatti, Samanabad, Lahore. Plus code: G7JV+C46.

## Pages
    index.html        Home: hero, live timing status, visit info, services preview, about teaser
    about.html        Story, key facts, photo gallery, Hamza Foundation network
    services.html     All services, dental clinic photo
    directions.html   "How far are you?" distance checker, address, Google Maps buttons
    contact.html      Phone, email, address, full opening hours, message form
    404.html          Shown by GitHub Pages when a link is wrong

## Shared files
    css/styles.css    Styles for every page
    js/data.js        Hospital details: coordinates, phone, email, opening hours, Lahore areas
    js/script.js      Mobile menu, Google Maps links, distance checker, live hours, contact form
    assets/           Logo, favicon and photos

The header and footer are repeated in each page. If you change a menu link, change it in all six files.

## Run it on your computer
Open index.html in a browser. "Use My Location" needs a web server:

    npx serve .          # or: python3 -m http.server 8000

## Publish on GitHub Pages
1. Sign in at github.com and click New repository.
2. Name it, for example hamza-foundation-hospital. Set it to Public. Click Create repository.
3. Click "uploading an existing file". Drag in everything inside this folder
   (index.html, the other .html files, and the css, js and assets folders). Click Commit changes.
4. Go to Settings > Pages. Under Source choose "Deploy from a branch", branch main, folder / (root). Save.
5. After a minute or two the site is live at https://YOUR-USERNAME.github.io/hamza-foundation-hospital/

To update later: open the repository, click Add file > Upload files, drop in the changed files, commit.

## Editing
- Opening hours / map location: js/data.js
- Services: services.html (full list) and index.html (first four shown on Home)
- The contact form opens the visitor's email app addressed to info@hamzafoundation.org.

## Still to confirm with the hospital
- Current opening hours, evening shift and Sunday
- Which services run at this centre (the entrance sign mentions a TB centre)
- Up-to-date patient and staff numbers
