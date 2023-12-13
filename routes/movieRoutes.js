const express = require("express");
const router = express.Router();
const Movie = require('../models/movieModel');
const User = require('../models/usersModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
// const { ObjectId } = require("bson");
// Route to handle form submission
router.get('/movieform',async(req,res)=>{
    try{
       await res.render('movies/moviezz')
    }catch(err){
        res.send(err)
    }
})

router.get('/moviezz', async (req, res) => {
    try {
      // Parse query parameters from the form
      const page = parseInt(req.query.page) || 1;
      const perPage = parseInt(req.query.perPage) || 5;
      const titleQuery = req.query.title || '';
  
      // Create a MongoDB query object based on the provided parameters
      const query = {};
      if (titleQuery) {
        query.title = { $regex: new RegExp(titleQuery, 'i') }; // Case-insensitive title search
      }
  
      // Fetch movies based on the query parameters
      const txt = await Movie.find(query)
        .skip((page - 1) * perPage)
        .limit(perPage).lean();
  
      // Render the form and pass the movie data
      res.render('movies/list', { txt });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


router.get('/api/Movies', async (req, res) => {
    try {
      // localhost:8000/api/movies?page=1&perPage=5&title=The Avengers
      const page = parseInt(req.query.page) || 1;
      const perPage = parseInt(req.query.perPage) || 2;
      const titleQuery = req.query.title || '';
      const query = {};
      if (titleQuery) {
        query.title = { $regex: new RegExp(titleQuery, 'i') }; 
      }
      const txt = await Movie.find(query)
        .skip((page - 1) * perPage)
        .limit(perPage).lean();

        // res.send(txt);
    //   console.log(txt);
      res.render('movies/list',{txt});
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

router.get('/signup',async (req, res) => {
    try{
    res.render('users/signup');
    }catch(err){
        res.send(err);
    }
  });
  
  router.post('/signup', async (req, res) => {
    // const { username, password } = req.body;
  
    try {
        const user = await User.findOne({username: req.body.username });
        if(user){
            res.render('users/signup',{errorMessage: "user exists"});
        }else{
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const newUser = new User({ username: req.body.username, password: hashedPassword });
      await newUser.save();
    //   res.send("success");
  
      res.redirect('/login');}
    } catch (error) {
      console.error(error);
      res.render('users/signup', { error: 'Error creating user.' });
    }
  });

 
  router.get('/login', (req, res) => {
    res.render('users/login');
  });
 



router.post('/login', async (req, res) => {
    // const { username, password } = req.body;
  
    try {
      const user = await User.findOne({username: req.body.username });
  
      if (user) {
        // Compare the provided password with the hashed password in the database
        const passwordMatch = await bcrypt.compare(req.body.password, user.password);
  
        if (passwordMatch) {
          const token = jwt.sign({ user }, 'secretkey');
          res.cookie('token', token);
          res.redirect('/');
        } else {
          res.render('users/login', { errorMessage: 'Wrong password' });
        }
      } 
    } catch (error) {
      console.error(error);
      res.render('login', { errorMessager: 'loginerror' });
    }
  });

  router.get('/', async (req, res) => {
    try {
        const token = req.cookies.token;
        if (token) {
            jwt.verify(token, 'secretkey', (err, data) => {
                if (err) {
                    return res.redirect('/login');
                }
                res.render('movies/index', { username: data.user.username });
            });
        } else {

            res.redirect('/login');
        }
    } catch (error) {
        res.send(error);
    }
});
// app.get('/update/movie', (req, res, next) =>{
//     res.render('movies/add')
// })
router.get('/add', async (req, res) => {
    
//     try{
//    await res.render("movies/add")
//     }
//     catch(error){
//         res.send(error);
//     }
try {
    const token = req.cookies.token;
    if (token) {
        jwt.verify(token, 'secretkey', (err, data) => {
            if (err) {
                return res.redirect('/login');
            }
            res.render("movies/add")
        });
    } else {

        res.redirect('/login');
    }}
    catch(error){
                res.send(error);
            }

  })

// gets all movies
// router.get('/api/Movies', async (req,res) => {
//     try{
//     const movies = await Movie.find()
//     res.send(movies);
//     }catch(error){
//         res.send("error")
//     }
// })


router.get('/sbp', async(req,res) => {
    // try{
    //     res.render('movies/sbp');
    // }catch(err){
    //     res.send(err);
    // }
    try {
        const token = req.cookies.token;
        if (token) {
            jwt.verify(token, 'secretkey', (err, data) => {
                if (err) {
                    return res.redirect('/login');
                }
                res.render('movies/sbp');
            });
        } else {
    
            res.redirect('/login');
        } }catch(err){
               res.send(err);
            }
})

// gets movie by plot
router.get('/api/:plot', async  (req,res) => {
    try{
    const movies = await Movie.findOne({plot: req.params.plot})
   if(movies == ''){
    res.send("error")
   }res.send(movies)
//    res.render('movies/add')
}catch(error){
    res.send(error)
}
   
})

router.post("/api/getMovieByPlot", async(req,res) => {
    try{
        // console.log(req.body.id);
        const txt = await Movie.findOne({plot:req.body.plot});
        res.render('movies/list', {txt});

    }catch(error){
        res.send(error);
    }
})


// get movie by _id
router.get('/searchById/:id', async (req,res) => {
    try{
    const movies = await Movie.findById(req.params.id)
    res.send(movies);
    }catch(error){
        res.send(error);
    }
});
// search
router.post("/api/getMovieId", async (req,res)=> {
    try{
        console.log(req.body.id);
        const txt = await Movie.findById(req.body.id);
        if(!txt){
            res.render('movies/index',{errorMessage: "no movies found"})
        }
        res.render('movies/list', {txt});

    }catch(error){
        res.send(error);
    }
})

// creates a movie
// post api/Movies i.e the 1st route as per the assignment
// router.post('/api/Movies', async (req,res) => {
// try{
//     const movie = await Movie.create({
//         plot: req.body.plot,
//         runtime : req.body.runtime,
//         title : req.body.title,
//         released : req.body.released

//     });
//     res.render('movies/index',{successMessage: "Movie Added"});
// }catch(error){
//     res.send(error);
// }
// })




router.post('/api/Movies', async (req, res) => {
    try {
        const movie = await Movie.create({
            plot: req.body.plot,
            genres: req.body.genres, // Assuming req.body.genres is an array
            runtime: req.body.runtime,
            cast: req.body.cast, // Assuming req.body.cast is an array
            num_mflix_comments: req.body.num_mflix_comments,
            poster: req.body.poster,
            title: req.body.title,
            fullplot: req.body.fullplot,
            languages: req.body.languages, // Assuming req.body.languages is an array
            released: req.body.released,
            directors: req.body.directors, // Assuming req.body.directors is an array
            writers: req.body.writers, // Assuming req.body.writers is an array
            awards: {
                wins: req.body.awards_wins,
                nominations: req.body.awards_nominations,
                text: req.body.awards_text,
            },
            lastupdated: req.body.lastupdated,
            year: req.body.year,
            imdb: {
                rating: req.body.imdb_rating,
                votes: req.body.imdb_votes,
                id: req.body.imdb_id,
            },
            countries: req.body.countries, // Assuming req.body.countries is an array
            type: req.body.type,
            tomatoes: {
                viewer: {
                    lastUpdated: req.body.tomatoes_lastUpdated,
                },
            },
        });

        res.render('movies/index', { successMessage: "Movie Added" });
    } catch (error) {
        res.send(error);
    }
});


// update using the put method
router.put('/api/movies/:id', async (req,res) => {
    try{
        const movies = await Movie.findById(req.params.id);
        if(!movies){
            res.send("no movie found")
        }

        const movieUpdate = await Movie.findByIdAndUpdate(req.params.id, req.body , {new : true})
        res.send("updated")


    }catch(error){
        res.status(500).send({ error: "Internal Server Error" });
    }
})

// update using the post method
router.post('/update/search/:id',async(req,res) => {
    try{
        
        const movies = await Movie.findByIdAndUpdate(req.params.id);
        if(!movies){
            res.send("no movie found")
        }

        const movieUpdate = await Movie.findByIdAndUpdate(req.params.id, req.body , {new : true})
        res.send("updated")

    }catch(error){
        res.send(error);
    }
})

router.post('/update/moviez',async(req,res) => {
    try{
        console.log(req.body);
        const movies = await Movie.findByIdAndUpdate(req.body.movieId);
        if(!movies){
            res.send("no movie found")
        }

        const movieUpdate = await Movie.findByIdAndUpdate(req.body.movieId, req.body , {new : true})
        res.render("movies/index",{successMessage: "Movie Updated"});

    }catch(error){
        res.send(error);
    }
})

// router.post('/upd',async(req,res)=>{
//     try{
//         res.send(req.body);
//     }catch(err){
//         res.send(err);
//     }
// })

router.post('/upd', async (req, res) => {
    try {
        // Extract the _id from the form
        const movieId = req.body._id;
        
        // Now you can use the movieId to fetch the movie from the database and perform the update
        
        // For now, just send the movieId as a response
        // res.redirect('/update',{movieId})
        res.redirect(`/update?movieId=${movieId}`);
    } catch (err) {
        res.send(err);
    }
})

router.post('/deletez',async(req,res)=>{
    try {
        // Extract the _id from the form
        const movieId = req.body._id;
        
        // Now you can use the movieId to fetch the movie from the database and perform the update
        
        // For now, just send the movieId as a response
        // res.redirect('/update',{movieId})
        res.redirect(`/delete?movieId=${movieId}`);
    } catch (err) {
        res.send(err);
    }
})

// delete
router.get('/delete', async (req,res) => {
//     try{
//    await res.render('movies/delete')
//     }catch(error){
//         res.send(error)
//     }

try {
    const token = req.cookies.token;
    if (token) {
        jwt.verify(token, 'secretkey', async (err, data) => {
            if (err) {
                return res.redirect('/login');
            }
            try{
            const movieId = req.query.movieId;
                console.log(movieId)
                // const movies = await Movie.findById(movieId).lean()
                // res.send(movies);

                res.render('movies/delete', { movieId })
            // res.render('movies/delete')
        }catch(err){
            res.send(err);
        }
        });
    } else {

        res.redirect('/login');
    } }catch(err){
           res.send(err);
        }


})

router.post('/dele',async(req,res) => {
    try{
        const movies = await Movie.findOneAndDelete({ _id: req.body.id });
        res.render("movies/index",{successMessage:"Movie Deleted"})
    }
catch(error){
    res.send(error)
}
});

router.get('/list',(req,res) => {
    try{
        res.render('movies/list')
    }catch(error){
        res.send(error)
    }
    
})

router.get('/search',(req,res) => {
    // try{
    // res.render('movies/search')
    // }catch(error){
    //     res.send(error)
    // }
    try {
        const token = req.cookies.token;
        if (token) {
            jwt.verify(token, 'secretkey', (err, data) => {
                if (err) {
                    return res.redirect('/login');
                }
                res.render('movies/search')
            });
        } else {
    
            res.redirect('/login');
        } }catch(err){
               res.send(err);
            }
})

router.get('/update',(req,res) => {
//     // try{
//     // res.render('movies/update')
//     // }catch(error){
//     //     res.send(error)
//     // }
    try {
        const token = req.cookies.token;
        if (token) {
            jwt.verify(token, 'secretkey', async (err, data) => {
                if (err) {
                    return res.redirect('/login');
                }
                const movieId = req.query.movieId;
                console.log(movieId)
                const movies = await Movie.findById(movieId).lean()
                // res.send(movies);

                res.render('movies/update', { movies })
            });
        } else {
    
            res.redirect('/login');
        } }catch(err){
               res.send(err);
            }
})

// router.get('/update', async (req, res) => {
//     try {
//         const token = req.cookies.token;
//         if (token) {
//             jwt.verify(token, 'secretkey', async (err, data) => {
//                 if (err) {
//                     return res.redirect('/login');
//                 }

//                 const movieId = req.query.movieId;
//                 console.log(movieId);

//                 try {
//                     // Use await to wait for the result of findById
//                     const movie = await Movie.findById(movieId);

//                     // Handle the result
//                     if (movie) {
//                         res.render('movies/update', { movie });
//                     } else {
//                         res.status(404).send('Movie not found');
//                     }
//                 } catch (error) {
//                     res.status(500).send(error.message);
//                 }
//             });
//         } else {
//             res.redirect('/login');
//         }
//     } catch (err) {
//         res.status(500).send(err.message);
//     }
// });

router.get('/logout', (req, res) => {
    
    res.clearCookie('token');
    res.redirect('/login');
  });

router.all("*", async (req,res) =>{ 
    try{
    res.render('movies/index', {errorMessage: "Page not found"});
    }catch(error){
        res.send(error)
    }
 });


module.exports = router;