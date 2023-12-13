// const mongoose = require('mongoose');

// const movieSchema = mongoose.Schema({
//     plot: {
//         type: String
//       },
//       genres: {
//         type: [String]
//       },
//       runtime: {
//         type: Number
//       },
//       cast: {
//         type: [String]
//       },
//       num_mflix_comments: {
//         type: Number
//       },
//       poster: {
//         type: String
//       },
//       title: {
//         type: String
//       },
//       fullplot: {
//         type: String
//       },
//       languages: {
//         type: [String]
//       },
//       released: {
//         type: Date
//       },
//       directors: {
//         type: [String]
//       },
//       writers: {
//         type: [String]
//       },
//       awards: {
//         wins: {
//           type: Number
//         },
//         nominations: {
//           type: Number
//         },
//         text: {
//           type: String
//         }
//         },
//         lastupdated: {
//           type: Date
//         },
//         year: {
//           type: Number
//         },
//       imdb: {
//         rating: {
//           type: Number,
//         },
//         votes: {
//           type: Number,
//         },
//         id: {
//           type: Number,
//         }
//       },
//       countries: {
//         type: [String],
//       },
//       type: {
//         type: String,
//       },
//       tomatoes: {
//         viewer: {
//           lastUpdated: {
//             type: Date
//           },
//         },
//       },
//     });

//     module.exports = mongoose.model('Movie',movieSchema)


const mongoose = require('mongoose');

const movieSchema = mongoose.Schema({
    plot: {
        type: String
    },
    genres: {
        type: [String]
    },
    runtime: {
        type: Number
    },
    cast: {
        type: [String]
    },
    num_mflix_comments: {
        type: Number
    },
    poster: {
        type: String
    },
    title: {
        type: String
    },
    fullplot: {
        type: String
    },
    languages: {
        type: [String]
    },
    released: {
        type: Date
    },
    directors: {
        type: [String]
    },
    writers: {
        type: [String]
    },
    awards: {
        wins: {
            type: Number
        },
        nominations: {
            type: Number
        },
        text: {
            type: String
        }
    },
    lastupdated: {
        type: Date
    },
    year: {
        type: Number
    },
    imdb: {
        rating: {
            type: Number,
        },
        votes: {
            type: Number,
        },
        id: {
            type: Number,
        }
    },
    countries: {
        type: [String],
    },
    type: {
        type: String,
    },
    tomatoes: {
        viewer: {
            rating: {
                type: Number
            },
            numReviews: {
                type: Number
            },
            meter: {
                type: Number
            },
            dvd: {
                type: Date
            },
            lastUpdated: {
                type: Date
            }
        }
    },
});

module.exports = mongoose.model('Movie', movieSchema);
