# Secret PasteBin

A lightweight, secure PasteBin application built with Next.js and PostgreSQL. This tool allows users to create temporary text "pastes" that automatically self-destruct based on a time-to-live (TTL) or a maximum view count.
---

🛠 Features
Self-Destructing Pastes: Set an expiration timer in seconds.

View Limits: Set a maximum number of allowed views before the paste is deleted.

High-Contrast UI: Minimalist black-and-white design for maximum readability.

Real-time Validation: Ensuring every paste has at least one safety restriction (TTL or Views).

UUID Protection: Every paste is assigned a unique, non-guessable identifier.
---

## 🚀 Local Setup

Follow these steps to get the project running on your local machine:
<p><b>Devlopment:</b></p>
<pre>
  <code>
      git clone https://github.com/sainathdora/PasteBin_Assignment.git
      cd PasteBin_Assignment
      npm i
      npm run dev
  </code>
</pre>
<p><b>Production:</b></p>
<pre>
  <code>
    npm run build
    npm start
  </code>
</pre>
<hr>
<h1>Note: The project uses neon postgres database, so while creating a <code>.env</code> folder, these variables must be present</h1>
<ol>
  <li>DATABASE_URL</li>
  <li>DATABASE_URL_UNPOOLED</li>

  <li>PGHOST</li>
  <li>PGHOST_UNPOOLED</li>
  <li>PGUSER</li>
  <li>PGDATABASE</li>
  <li>PGPASSWORD</li>

  <li>POSTGRES_URL</li>
  <li>POSTGRES_URL_NON_POOLING</li>
  <li>POSTGRES_USER</li>
  <li>POSTGRES_HOST</li>
  <li>POSTGRES_PASSWORD</li>
  <li>POSTGRES_DATABASE</li>
  <li>POSTGRES_URL_NO_SSL</li>
  <li>POSTGRES_PRISMA_URL</li>

  <li>TEST_MODE</li>
</ol>
<h3>TEST_MODE</h3>
<p>If the environment variable <pre>
  <code>
  TEST_MODE=1
  </code>
</pre>
is set:<br>
  The request header <code>x-test-now-ms(milliseconds since epoch)</code> 
must be treated as the current time for expiry logic only</p>

<hr>
<h1>Persistence Layer</h1>
This project uses PostgreSQL hosted on Neon as its persistence layer.
Neon provides a serverless PostgreSQL experience with high availability. The database schema manages the following:
<ul>
  <li>
    ID: Primary key (UUID).
  </li>
<li>Content: The raw text data.
</li>
  <li>
Created: Timestamp of creation.
  </li>
<li>
Expiry: Optional timestamp for time-based deletion.
</li>
<li>
ViewsLeft: Integer count for view-based deletion.
</li>
</ul>
<hr>
<h1>Demo</h1>
<ol>
  <li>
    1)Visit <a href="https://paste-bin-assignment.vercel.app/">Website</a>
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/8aa6fc49-daf4-4dee-96fa-6c48c6752593" />
  </li>
  <li>
    Add the content and set the max views(optional) and expiry(optional), you have to set either of them only then input will be accepted
  </li>
  <li>
    Click on Create Paste
  </li>
  <li>
    <img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/56d7e679-38e1-4596-b7a7-a7f561ed058a" />
    <p>You can now Copy the url and share it with others!!. This content will persist until the given constrainsts are violated(either time or max views).</p>
  </li>
</ol>
