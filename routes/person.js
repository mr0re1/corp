module.exports = function(app){

  var person_list_get = function(req, res, next) {
    app.person_controller.getPersons({}, function(persons){
      res.persons = persons;
      next();
    }.cf(next));
  };
  
  var person_get = function(req, res, next) {
    app.person_controller.getPerson(req.params.id, function(person){
      res.person = person;
      next();
    }.cf(next));
  };

  var person_add = function(req, res, next) {
    var form = req.body;
    form.user = req.user;
    form.files = req.files;
    app.person_controller.addPerson(
      form,
      function(err, id){
        if (err) {
          form.error = err;
          req.personaddform = form;
          next();
        }
        else res.redirect('/person/' + id);
      });
  };

  var person_list_view = function(req, res){
    res.render(
      'persons',
      {
        user: req.user,
        title: 'Респонденты',
        persons: res.persons,
      }
    );
  };

  var person_view = function(req, res){
    res.render(
      'person',
      {
        user: req.user,
        title: 'Респондент ' + res.person.name,
        person: res.person,
      }
    );
  };

  var person_add_view = function(req, res){
    res.render(
      'personadd',
      {
        form: req.personaddform || {},
        user: req.user,
        title: 'Добавление респондента',
      }
    )
  };


  app.get('/person', person_list_get, person_list_view);
  app.get('/person/:id', person_get, person_view);
  app.get('/person-add', person_add_view);
  app.post('/person-add', person_add, person_add_view);
}
