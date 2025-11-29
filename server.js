const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const Tutor = require('./models/tutor.model');
const Animal = require('./models/animal.model');
const Agendamento = require('./models/agendamento.model');
const db = require('./config/database');

// Definir relacionamentos
Tutor.hasMany(Animal, { foreignKey: 'tutorId', as: 'Animais' });
Animal.belongsTo(Tutor, { foreignKey: 'tutorId', as: 'Tutor' });

Animal.hasMany(Agendamento, { foreignKey: 'animalId', as: 'Agendamentos' });
Agendamento.belongsTo(Animal, { foreignKey: 'animalId', as: 'Animal' });
//
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.engine('handlebars', exphbs.engine({
    defaultLayout: false, 
    helpers: {
        eq: (a, b) => a === b
    }}));

app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({extended: true}));

db.sync({force: true}).then(() => {
    console.log('Banco de dados sincronizado');
});

/*
let tutores = [ // tirar qnd tiver tudo certo
    {id: 1, nome: "João Silva", telefone: "(11) 99999-1111", email: "joao@email.com"},
    {id: 2, nome: "Maria Santos", telefone: "(11) 99999-2222", email: "maria@email.com"},
    {id: 3, nome: "Pedro Oliveira", telefone: "(11) 99999-3333", email: "pedro@email.com"},
];

let animais = [ // tirar qnd tiver tudo certo
    {id: 1, nome: "Rex", especie: "cachorro", raca: "Labrador", idade: 3, tutorId: 1},
    {id: 2, nome: "Mimi", especie: "gato", raca: "Persa", idade: 2, tutorId: 2},
    {id: 3, nome: "Bolinha", especie: "cachorro", raca: "Bulldog", idade: 5, tutorId: 1},
];

let agendamentos = [ // tirar qnd tiver tudo certo
    {id: 1, animalId: 1, tipoVacina: "V8", data: "2024-12-20", horario: "10:00", status: "agendado"},
    {id: 2, animalId: 2, tipoVacina: "Antirrábica", data: "2024-12-18", horario: "14:30", status: "realizado"},
    {id: 3, animalId: 3, tipoVacina: "V10", data: "2024-12-22", horario: "09:00", status: "agendado"},
];*/

app.get('/', (req, res) => {
    res.render('home');
})


app.get('/tutores', async (req, res) => {
    try {
        let tutores = await Tutor.findAll();
        tutores = tutores.map(tutor => tutor.dataValues);
        res.render('listarTutores', {tutores});
    } catch (error){
        console.log(error);
        res.status(500).send('Erro ao buscar tutores');
    }
});


app.get('/tutores/novo', (req, res) => {
    res.render('cadastrarTutor');
});

//cadastrar tutor
app.post('/tutores', async (req, res) => {
    try {
        await Tutor.create({nome: req.body.nome, telefone: req.body.telefone, email: req.body.email});
        res.redirect('/tutores');
    } catch (error){
        console.log(error);
        res.status(500).send('Erro ao cadastrar tutor');
    }
});

//detalhar tutor
app.get('/tutores/:id', async (req, res) => {
    try {
        let id = parseInt(req.params.id);
        let tutor = await Tutor.findByPk(id);
        if (tutor) {
            res.render('detalharTutor', {tutor: tutor.dataValues});
        } else {
            res.status(404).send('Tutor não encontrado');
        }
    } catch (error) {
        console.log(error);
        res.status(500).send('Erro ao buscar tutor');
    }
});

//editar tutor

app.get('/tutores/:id/editar', async (req, res) => {
    try {
        let id = parseInt(req.params.id);
        let tutor = await Tutor.findByPk(id);
        if(!tutor)
            return res.status(404).send('Tutor não encontrado.');
        res.render('editarTutor', {tutor: tutor.dataValues});
    } catch (error) {
        console.log(error);
        res.status(500).send('Erro ao buscar tutor');
    }
});

//atualizar tutor
app.post('/tutores/:id', async (req, res) => {
    try {
        let id = parseInt(req.params.id);
        let tutor = await Tutor.findByPk(id);
        if (tutor) {
            await tutor.update({
                nome: req.body.nome,
                telefone: req.body.telefone,
                email: req.body.email
            });
            res.redirect('/tutores');
        } else {
            res.status(404).send('Tutor não encontrado');
        }
    } catch (error) {
        console.log(error);
        res.status(500).send('Erro ao atualizar tutor');
    }
});

//excluir tutor
app.post('/tutores/:id/excluir', async (req, res) => {
    try {
        let id = parseInt(req.params.id);
        let tutor = await Tutor.findByPk(id);
        if(tutor) {
            await tutor.destroy();
            res.redirect('/tutores');
        } else {
            return res.status(404).send('Tutor não encontrado.');
        }
    } catch (error) {
        console.log(error);
        res.status(500).send('Erro ao excluir tutor');
    }
});

//listar animais
app.get('/animais', async (req, res) => {
    try {
        let animais = await Animal.findAll({
            include: [{model: Tutor, as: 'Tutor'}]
        });
        animais = animais.map(a => a.dataValues);
        res.render('listarAnimais', {animais: animais});
    } catch (error) {
        console.log(error);
        res.status(500).send('Erro ao buscar animais');
    }
});

//cadastrar animal
app.get('/animais/novo', async (req, res) => {
    try {
        let tutores = await Tutor.findAll();
        tutores = tutores.map(t => t.dataValues);
        res.render('cadastrarAnimal', {tutores: tutoresData});
    } catch (error) {
        console.log(error);
        res.status(500).send('Erro ao buscar tutores');
    }
});

//cadastrar animamisd
app.post('/animais', async (req, res) => {
    try {
        await Animal.create({nome: req.body.nome, especie: req.body.especie, raca: req.body.raca,
             idade: parseInt(req.body.idade), tutorId: parseInt(req.body.tutorId)});
        res.redirect('/animais');
    } catch (error) {
        console.log(error);
        res.status(500).send('Erro ao cadastrar animal');
    }
});

//detalhar animal
app.get('/animais/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const animal = await Animal.findByPk(id, {
            include: [{model: Tutor, as: 'Tutor'}]
        });
        if (animal) {
            const animalData = animal.dataValues;
            res.render('detalharAnimal', {
                animal: {
                    ...animalData,
                    tutorNome: animalData.Tutor ? animalData.Tutor.nome : 'Não informado'
                }
            });
        } else {
            res.status(404).send('Animal não encontrado');
        }
    } catch (error) {
        console.log(error);
        res.status(500).send('Erro ao detalhar animal');
    }
});

//editar animal
app.get('/animais/:id/editar', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const animal = await Animal.findByPk(id);
        const tutores = await Tutor.findAll();
        if(!animal)
            return res.status(404).send('Animal não encontrado.');
        const tutoresData = tutores.map(t => t.dataValues);
        res.render('editarAnimal', {animal: animal.dataValues, tutores: tutoresData});
    } catch (error) {
        console.log(error);
        res.status(500).send('Erro ao editar animal');
    }
});

//atualizar animal

app.post('/animais/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const animal = await Animal.findByPk(id);
        if (animal) {
            await animal.update({
                nome: req.body.nome,
                especie: req.body.especie,
                raca: req.body.raca,
                idade: parseInt(req.body.idade),
                tutorId: parseInt(req.body.tutorId)
            });
            res.redirect('/animais');
        } else {
            res.status(404).send('Animal não encontrado');
        }
    } catch (error) {
        console.log(error);
        res.status(500).send('Erro ao atualizar animal');
    }
});

//excluir animal

app.post('/animais/:id/excluir', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const animal = await Animal.findByPk(id);
        if(animal) {
            await animal.destroy();
            res.redirect('/animais');
        } else {
            return res.status(404).send('Animal não encontrado.');
        }
    } catch (error) {
        console.log(error);
        res.status(500).send('Erro ao excluir animal');
    }
});

//listar agendamentos

app.get('/agendamentos', async (req, res) => {
    try {
        const agendamentos = await Agendamento.findAll({
            include: [{
                model: Animal,
                as: 'Animal',
                include: [{model: Tutor, as: 'Tutor'}]
            }]
        });
        const agendamentosComDados = agendamentos.map(ag => {
            const agData = ag.dataValues;
            const animal = agData.Animal;
            const tutor = animal && animal.Tutor ? animal.Tutor : null;
            return {
                ...agData,
                animalNome: animal ? animal.nome : 'Não informado',
                animalEspecie: animal ? animal.especie : '',
                tutorNome: tutor ? tutor.nome : 'Não informado'
            };
        });
        res.render('listarAgendamentos', {agendamentos: agendamentosComDados});
    } catch (error) {
        console.log(error);
        res.status(500).send('Erro ao buscar agendamentos');
    }
});

//cadastrar agendamento

app.get('/agendamentos/novo', async (req, res) => {
    try {
        const animais = await Animal.findAll();
        const animaisData = animais.map(a => a.dataValues);
        res.render('cadastrarAgendamento', {animais: animaisData});
    } catch (error) {
        console.log(error);
        res.status(500).send('Erro ao buscar animais');
    }
});

app.post('/agendamentos', async (req, res) => {
    try {
        const {animalId, tipoVacina, data, horario, status} = req.body;
        await Agendamento.create({
            animalId: parseInt(animalId),
            tipoVacina: tipoVacina,
            data: data,
            horario: horario,
            status: status
        });
        res.redirect('/agendamentos');
    } catch (error) {
        console.log(error);
        res.status(500).send('Erro ao cadastrar agendamento');
    }
});

app.get('/agendamentos/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const agendamento = await Agendamento.findByPk(id, {
            include: [{
                model: Animal,
                as: 'Animal',
                include: [{model: Tutor, as: 'Tutor'}]
            }]
        });
        if (agendamento) {
            const agData = agendamento.dataValues;
            const animal = agData.Animal;
            const tutor = animal && animal.Tutor ? animal.Tutor : null;
            res.render('detalharAgendamento', {
                agendamento: {
                    ...agData,
                    animal: animal,
                    tutor: tutor
                }
            });
        } else {
            res.status(404).send('Agendamento não encontrado');
        }
    } catch (error) {
        console.log(error);
        res.status(500).send('Erro ao buscar agendamento');
    }
});

app.get('/agendamentos/:id/editar', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const agendamento = await Agendamento.findByPk(id);
        const animais = await Animal.findAll();
        if(!agendamento)
            return res.status(404).send('Agendamento não encontrado.');
        const animaisData = animais.map(a => a.dataValues);
        res.render('editarAgendamento', {agendamento: agendamento.dataValues, animais: animaisData});
    } catch (error) {
        console.log(error);
        res.status(500).send('Erro ao buscar agendamento');
    }
});

app.post('/agendamentos/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const agendamento = await Agendamento.findByPk(id);
        if (agendamento) {
            await agendamento.update({
                animalId: parseInt(req.body.animalId),
                tipoVacina: req.body.tipoVacina,
                data: req.body.data,
                horario: req.body.horario,
                status: req.body.status
            });
            res.redirect('/agendamentos');
        } else {
            res.status(404).send('Agendamento não encontrado');
        }
    } catch (error) {
        console.log(error);
        res.status(500).send('Erro ao atualizar agendamento');
    }
});

app.post('/agendamentos/:id/excluir', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const agendamento = await Agendamento.findByPk(id);
        if(agendamento) {
            await agendamento.destroy();
            res.redirect('/agendamentos');
        } else {
            return res.status(404).send('Agendamento não encontrado.');
        }
    } catch (error) {
        console.log(error);
        res.status(500).send('Erro ao excluir agendamento');
    }
});

app.listen(port, () => {
    console.log(`Servidor em execução: http://localhost:${port}`);

});
