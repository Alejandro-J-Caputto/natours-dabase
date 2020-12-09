// const fs = require('fs')

// const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));


// exports.getAllTours = (req, res) => {

//     res
//         .status(200)
//         .json({
//             status: 'success',
//             requestedAt: req.requestTime,
//             results: tours.length,
//             data: {
//                 tours: tours
//             }
//         })
// }


// exports.postTour = (req, res) => {
//     // console.log(req.body)
//     console.log(tours.length)
//     const newId = tours[tours.length - 1].id + 1;
//     console.log(newId)
//     const newTour = Object.assign({ id: newId }, req.body);
//     tours.push(newTour);
//     fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
//         res
//             .status(201)
//             .json({
//                 status: 'success',
//                 data: {
//                     tour: newTour
//                 }
//             })
//     })

//     // res.send('perfecto')

// }


// exports.getTourByID = (req, res) => {
//     let id = req.params.id;


//     console.log(id)

//     // tours.map(el => {
//     //     if ((el.id + 1) == id) {
//     //         res
//     //             .status(200)
//     //             .json({
//     //                 status: 'success',
//     //                 tour: el
//     //             })
//     //     }
//     // })

//     const tour = tours.find(el => {
//         if ((el.id) == (id)) {
//             return el
//         }
//     })
//     //if( id > tours.length) otra opcion que me parece menos elegante para validar si existe y mandar el 400
//     if (!tour) {
//         return res.status(400).json({
//             status: 'fail',
//             message: 'invalid ID'
//         })
//     }

//     res
//         .status(200)
//         .json({
//             status: "success",
//             data: {
//                 tour
//             }
//         })
// }

// exports.editTour = (req, res) => {
//     let id = req.params.id;


//     console.log(id)

//     // tours.map(el => {
//     //     if (el.id == (id - 1)) {
//     //         console.log(el.id)
//     //         el.name = req.body.name
//     //         console.log('patata')
//     //         fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
//     //             res
//     //                 .status(200)
//     //                 .json({
//     //                     status: 'success',
//     //                     tour: el
//     //                 })

//     //         })
//     //     }
//     // })

//     if (id > tours.length) {
//         return res.status(404).json({
//             status: 'fail',
//             message: 'invalid ID'
//         })
//     }
//     tours.find(el => {

//         if (el.id == id) {
//             el.name = req.body.name
//             fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
//                 res
//                     .status(200)
//                     .json({
//                         status: 'success',
//                         tour: el
//                     })

//             })
//         }
//         // if (!el) {
//         //     return res.status(400).json({
//         //         status: 'fail',
//         //         message: 'invalid ID'
//         //     })
//         // }
//     })
// }

// exports.patchTour = (req, res) => {
//     if (req.params.id > tours.length) {
//         return res.status(400).json({
//             status: 'fail',
//             message: 'invalid ID'
//         })
//     }
//     res.status(200).json({
//         status: 'success',
//         data: {
//             tour: '<Updated tour here>'
//         }
//     })
// }
// exports.deleteTour = (req, res) => {
//     let id = req.params.id * 1;

//     if (id > tours.length) {
//         return res.status(404).json({
//             status: 'fail',
//             message: 'The ID doesnt exist'
//         })
//     }
//     console.log('patata')
//     const elementos = tours.filter(el => el.id !== id)
//     fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(elementos), err => {

//         res
//             .status(200)
//             .json({
//                 status: 'success',
//                 tours: elementos
//             })
//     })
// }