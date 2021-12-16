const express = require('express');
const pool = require('./database');
const cors = require('cors');
const app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(express.static('Public'));
app.use(express.static(__dirname + '/public'));


app.listen(3000, () => {
    console.log("Server is listening to port 3000")
});


app.get('/posts', async(req, res) => {
    try {
        console.log("get posts request has arrived");
        const posts = await pool.query("SELECT * FROM nodetable");
        res.render('posts', { posts: posts.rows });
    } catch (err) {
        console.error(err.message);
    }
});


app.get('/singlepost/:id', async(req, res) => {
    try {
        const id = req.params.id;
        console.log(req.params.id);
        console.log("get a single post request has arrived");
        const posts = await pool.query("SELECT * FROM nodetable WHERE id = $1", [id]);
        console.log("GOT INFO")
        res.render('singlepost', { posts: posts.rows[0] });

    } catch (err) {
        console.error(err.message);
    }
});


app.get('/posts/:id', async(req, res) => {
    try {
        const { id } = req.params;
        console.log("get a post request has arrived");
        const Apost = await pool.query("SELECT * FROM nodetable WHERE id = $1", [id]);
        res.json(Apost.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});


app.delete('/posts/:id', async(req, res) => {
    try {
        console.log(req.params);
        const { id } = req.params;
        const post = req.body;
        console.log("delete a post request has arrived");
        const deletepost = await pool.query("DELETE FROM nodetable WHERE id = $1", [id]);
        res.redirect('posts');
    } catch (err) {
        console.error(err.message);
    }
});

let datenow = new Intl.DateTimeFormat('en-GB', { year: 'numeric', month: 'long', day: '2-digit'}).format(new Date())
app.post('/posts', async(req, res) => {
    try {
        const post = req.body;
        console.log(post);
        const newpost = await pool.query(
            "INSERT INTO nodetable(date, body, likes, posturl, userurl) values ($1, $2, $3, $4, $5)RETURNING*", [datenow, post.body, 0, post.posturl, post.userurl]);
        res.redirect('posts');
    } catch (err) {
        console.error(err.message)
    }
});

app.put('/singlepost/:id', async(req, res) => {
    try {
        const { id } = req.params;
        const post = req.body;
        console.log("update request has arrived");
        const updatepost = await pool.query(
            "UPDATE nodetable SET likes = likes + 1"
        );
        res.json(post);
    } catch (err) {
        console.error(err.message);
    }
});


app.get('/addnewpost', (req, res) => {
    res.render('addnewpost');
});


app.use((req, res) => {
    res.status(404).render('404');
});

