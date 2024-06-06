const { PrismaClient } = require('@prisma/client');
const slugify = require('slugify');
const prisma = new PrismaClient();

// Funzione per generare uno slug unico
const generateUniqueSlug = async (title) => {
    let slug = slugify(title, { lower: true, strict: true });
    let uniqueSlug = slug;
    let count = 1;

    // Verifica l'esistenza dello slug
    while (await prisma.post.findUnique({ where: { slug: uniqueSlug } })) {
        uniqueSlug = `${slug}-${count}`;
        count++;
    }

    return uniqueSlug;
};

// Creare un nuovo post
exports.createPost = async (req, res) => {
    const { title, image, content, published } = req.body;
    try {
        const slug = await generateUniqueSlug(title); // Generazione dello slug unico
        const post = await prisma.post.create({
            data: {
                title,
                slug,
                image,
                content,
                published,
            },
        });
        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ error: 'Qualcosa è andato storto' });
    }
};

// Recuperare un post tramite il suo slug
exports.getPostBySlug = async (req, res) => {
    const { slug } = req.params;
    try {
        const post = await prisma.post.findUnique({
            where: { slug },
        });
        if (post) {
            res.status(200).json(post);
        } else {
            res.status(404).json({ error: 'Post non trovato' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Qualcosa è andato storto' });
    }
};

// Ottenere tutti i post con opzione di filtro per pubblicati e non pubblicati
exports.getPosts = async (req, res) => {
    const { published } = req.query;
    try {
        let posts;

        // Se è stato fornito un parametro "published" nel query string
        if (published !== undefined) {
            // Converti il valore in boolean
            const isPublished = published === 'true';

            // Filtra i post in base allo stato di pubblicazione
            posts = await prisma.post.findMany({
                where: { published: isPublished },
            });
        } else {
            // Se non è fornito alcun parametro "published", restituisci tutti i post
            posts = await prisma.post.findMany();
        }

        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: 'Qualcosa è andato storto' });
    }
};


// Aggiornare un post tramite il suo slug
exports.updatePostBySlug = async (req, res) => {
    const { slug } = req.params;
    const { title, image, content, published } = req.body;
    try {
        const newSlug = await generateUniqueSlug(title); // Generazione del nuovo slug unico
        const post = await prisma.post.update({
            where: { slug },
            data: {
                title,
                slug: newSlug,
                image,
                content,
                published,
            },
        });
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ error: 'Qualcosa è andato storto' });
    }
};

// Eliminare un post tramite il suo slug
exports.deletePostBySlug = async (req, res) => {
    const { slug } = req.params;
    try {
        await prisma.post.delete({
            where: { slug },
        });
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: 'Qualcosa è andato storto' });
    }
};
