const express = require('express')
const server = express.Router()
const db = require('../helpers/index.js')

filter = (allArray, params) => {
    console.log("allArray", allArray)
    console.log("params", params)
    let newArr = allArray.filter(item => {
       //filter users cards base on city here

       //locate only , this calculated distance 
       function distance(lat1, lon1, lat2, lon2, filter) {
            if ((lat1 == lat2) && (lon1 == lon2)) {
                return 0;
            }
            else {
                var radlat1 = Math.PI * lat1/180;
                var radlat2 = Math.PI * lat2/180;
                var theta = lon1-lon2;
                var radtheta = Math.PI * theta/180;
                var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
                if (dist > 1) {
                    dist = 1;
                }
                dist = Math.acos(dist);
                dist = dist * 180/Math.PI;
                dist = dist * 60 * 1.1515;
        
            if (dist < filter) {
                console.log('user is within chosen miles of origin location!')
                return dist;
            } else {
                console.log('user to too far!')
                return dist;
            }
            }
        }

       //filters based on job area
        return params.filters.includes(item.area_of_work)
    })
    if(newArr.length === 0){
        newArr = allArray
    }
    console.log("newArr in filter", newArr)
    return {
        usersArr: newArr, 
        usersLength: newArr.length
    }
}

//get all users for card view
server.post('/infiniteFilter', (req, res) => {
    console.log(req.body)
    db.user_helpers.getUsers().then(users => {
        console.log(users)
        //users here
        //req.body will have the state from front end. 
        //filters
        let returnPackage = filter(users, req.body);
        //return 10 at a time of filtered UserCards
        console.log("return package", returnPackage)
        res.status(200).json(returnPackage)
    }).catch(err => {
        console.log("there is an error in GET users/", err)
        res.status(500).json({message: "there is an error in GET users/", err: err})
    })
})

//get all users for card view
server.get('/', (req, res) => {
    db.user_helpers.getUsers().then(users => {
        res.status(200).json(users)
    }).catch(err => {
        console.log("there is an error in GET users/", err)
        res.status(500).json({message: "there is an error in GET users/", err: err})
    })
})

//get specific user for user profile
server.get('/:email', (req, res) => {
    db.user_helpers.getUsers(req.params.email).then(user => {
        res.status(200).json(user)
    }).catch(err => {
        console.log("error fetching data at GET users/:email", err)
        res.status(500).json({ message: "error fetching data at GET users/:email", err: err });
    })
})

//add user
//expects req.body with email, first_name, last_name at minimum
//email must be unique in database
//empty values will fill with null
server.post('/new', (req, res) => {
    db.user_helpers.getUsers(req.body.email).then(user => {
      if(user){
        res.status(200).json(user)
      } else {
        db.user_helpers.addUser(req.body).then(user2 => {
            res.status(200).json(user2)
        }).catch(err => {
            console.log(err)
        })
      }
    }).catch(err => {
      console.log("error posting data at POST users/new", err)
      res.status(500).json({ message: "error posting data at POST users/new", err: err });
    })
  })

server.put('/:id', (req, res) => {
    db.user_helpers.editUser(req.params.id, req.body).then(user => {
        res.status(200).json(user)
    }).catch(err => {
        res.status(500).json({message: "error editing user data", err: err})
    })
})

server.delete('/:id', (req, res) => {
    db.user_helpers.deleteUser(req.params.id).then(user => {
        res.status(200).json(user)
    }).catch(err => {
        res.status(500).json({message: "error deleting user", err: err})
    })
})


//get skills
//expects type in path param as either "top_skills" "add_skills" or "familiar" 
server.get('/:id/skills/:type', (req, res) => {
    db.getUserSkills(req.params.id, req.params.type).then(skills => {
        res.status(200).json(skills)
    }).catch(err => {
        console.log("there is an error in users/:id/:type", err)
        res.status(500).json({message: "there is an error in users/:id/:type", err: err})
    })
})

//add a skill *from* the skill bank
//expects user id and skill type in path params
//expects skill id in req.body ex."id":"1"
server.post('/:user_id/addskills/:type', (req, res) => {
    db.user_helpers.getUserSkillID(req.params.user_id, req.params.type).then(oldSkillsList => {
        let oldSkills = oldSkillsList[req.params.type] + `,${req.body['id']}`
        db.addKeywords(req.params.userid, req.params.type, oldSkills).then(data => {
            res.status(200).json(data)
        })}).catch(err => {
            console.log("error adding from skill bank", err)
            res.status(500).json({message: "error adding from skill bank", err: err})
    })
})

//add a completely new skill to the skill bank
//expects user id and skill type in path params
//expects skill name in req.body ex. "skill": "Python" 
server.post('/:user_id/createskill/:type', (req, res) => {
    db.createKeywords(req.body).then(async function(data) {
        let oldSkills = await db.user_helpers.getUserSkillID(req.params.user_id, req.params.type);
        console.log("oldskills:", oldSkills);
        console.log("data:", data);
        if (oldSkills[req.params.type] === null) {
            console.log("are u a number other than 1:", `${data}`)
            db.addKeywords(req.params.user_id, req.params.type, `${data}`).then(resdata => {
                console.log(resdata)
                res.status(200).json(resdata)
            })
        } else {
            console.log("should be a number as a string:", `${data}`)
            oldSkills = oldSkills[req.params.type] + `,${data}`
            db.addKeywords(req.params.user_id, req.params.type, oldSkills).then(resdata => {
                res.status(200).json(resdata)
            }).catch(err => {
                console.log("there is an error in users/addskill/:id/:type at addKey", err)
                res.status(500).json({message: "there is an error in users/addskill/:id/:type at addKey", err: err})
            })
        }
    }).catch(err => {
        console.log("there is an error in users/createskill/:id/:type at createKey", err)
        res.status(500).json({message: "there is an error in users/createskill/:id/:type at createKey", err: err})
    })
})

//gets projects, experience, or education 
//expects one of the above terms in place of "extras" in path param. ex. '/:userid/education'
server.get('/:user_id/:extras', (req, res) => {
    db.getExtras(req.params.user_id, req.params.extras).then(extras => {
        res.status(200).json(extras)
    }).catch(err => {
        res.status(500).json({message: "error fetching data", err: err})
    })
})


//add project, experience, or education
//req.body expectations for project: "user_id", "project_title", "project_description"
//"link", "project_img" 
//for experience: "user_id", "job_title", "job_description", "job_dates"
//for education: "user_id", "school", "school_dates", "degree", "course"
//only user_id and title/school are required for a post
server.post('/:user_id/:extras', (req, res) => {
    db.addExtra(req.params.extras, req.body).then(extra => {
        res.status(200).json(extra)
    }).catch(err => {
        res.status(500).json({message: "error adding extras data", err: err})
    })
})

//edit project/experience/education
//expects project/experience/education ID as param extrasID
//expects edited fields in req.body
server.put('/:user_id/:extras/:extras_id', (req, res) => {
    db.editExtra(req.params.extras_id, req.params.extras, req.body).then(extra => {
        res.status(200).json(extra)
    }).catch(err => {
        res.status(500).json({message: "error editing extras data", err: err})
    })
})

server.delete('/:user_id/:extras/:extras_id', (req, res) => {
    db.deleteExtra(req.params.extras_id, req.params.extras).then(extra => {
        res.status(200).json(extra)
    }).catch(err => {
        res.status(500).json({message: "error deleting extras data", err: err})
    })
})

module.exports = server