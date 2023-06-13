const express = require('express');
const app = express();
const Joi = require('joi');
// express.json() enables parsing of json
app.use(express.json())

const courses = [{'name': 'biology', 'id': 1}, {'name': 'physics', 'id': 2}, {'name': 'chemistry', 'id': 3}]

// made a function that implements Joi schema validation
// so i dont have to rewrite it everytime
function validater(req_body) {
  const schema = Joi.object().keys({
    name: Joi.string().min(3).max(30).required()
  });

  // used schema.validate as joi.validate seems to not work
  const result = schema.validate(req_body);
  return result
}

app.get('/', (req, res) => {
  res.send('Hello World');
});

// get request that returns all courses
app.get('/api/courses', (req, res) => {
  res.send(courses);
})

app.post ('/api/courses', (req, res) => {
  // post request to create a new course.

  // if no name is given return err message
  
  const result = validater(req.body)
  if(result.error) {
    res.status(400).send(result.error.details[0].message);
    return
  }

  // set attributes of new course added
  // new_id is total number of courses + 1
  const new_id = courses.length + 1;
  const course_name = req.body.name;
  const new_course = {'name': course_name, 'id': new_id};
  courses.push(new_course);
  res.send(courses);
});

// get request to return the name of the course with the given id
// used parse int because curl does not work without it, postman does though
app.get('/api/courses/:id', (req, res) => {
  const course = courses.find((course) => course.id === parseInt(req.params.id));
  if (!course) {
    // send the status and exit by return
    return res.status(404).send('No course found, id is invalid');
  }
  res.send({'course_name': course.name});
})

app.put('/api/courses/:id', (req, res) => {
  // put request to edit the value of a course
  // again, i used parse int because curl does not work without it, postman does though

  const result = validater(req.body)
  if(result.error) {
    res.status(400).send(result.error.details[0].message);
    return
  }
  const course = courses.find((course) => course.id === parseInt(req.params.id));
  if (!course) {
    // send the status and exit by return
    return res.status(404).send('No course found, id is invalid');
  }
  course.name = req.body.name
  res.send(courses);
});

app.delete('/api/courses/:id', (req, res) => {
  const course = courses.find((course) => course.id === parseInt(req.params.id));
  if (!course) {
    return res.status(404).send('No course found, id is invalid');
  }
  //find the index where course is
  const index = courses.indexOf(course);
  courses.splice(index, 1);
  res.send(courses);
});
// assign port to env variable or 3000 if none is given
const port = process.env.PORT || 3000
app.listen(port, () => {console.log(`Listening on port ${port}`);});