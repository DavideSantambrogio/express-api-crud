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
    try {
        const where = {};
        const { published, page = 1, pageSize = 5 } = req.query;

        // Aggiungi il filtro per lo stato di pubblicazione se specificato
        if (published !== undefined) {
            where.published = published === 'true';
        }

        // Calcola l'offset per la paginazione
        const offset = (page - 1) * pageSize;

        // Conta il numero totale di post
        const totalItems = await prisma.post.count({ where });

        // Calcola il numero totale di pagine
        const totalPages = Math.ceil(totalItems / pageSize);

        // Verifica se la pagina richiesta esiste
        if (page > totalPages) {
            throw new Error('La pagina richiesta non esiste.');
        }

        // Ottieni i post con paginazione
        const posts = await prisma.post.findMany({
            where,
            take: parseInt(pageSize),
            skip: parseInt(offset)
        });

        res.json({
            data: posts,
            page: page,
            totalItems: totalItems,
            totalPages: totalPages
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
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
