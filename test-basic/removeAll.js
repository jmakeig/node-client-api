/*
 * Copyright 2014 MarkLogic Corporation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var should = require('should');

var testconfig = require('../etc/test-config.js');

var marklogic = require('../');

var db = marklogic.createDatabaseClient(testconfig.restWriterConnection);
var restAdminDB = marklogic.createDatabaseClient(testconfig.restAdminConnection);

// NOTE: clears the forest
describe('document remove all', function(){
  before(function(done){
    var types = ['collection', 'directory', 'all'];
    var max = 2;
    var docs = [];
    types.forEach(function(type){
      var collection = '/removeAll/'+type;
      for (var i=0; i < max; i++) {
        docs.push({
          uri: collection+'/doc'+i+'.txt',
          collections: [collection],
          contentType: 'text/plain',
          content: type+' text '+i
          });
      }
    });
    db.documents.write(docs).
    result(function(response){done();}, done);
  });
  it('should remove the collection', function(done){
    this.timeout(5000);
    db.removeAll({collections:'/removeAll/collection'}).
    result(function(result) {
      return db.probe('/removeAll/collection/doc'+1+'.txt').result();
      }, done).
    then(function(document) {
      document.should.be.ok;
      document.exists.should.eql(false);
      return db.probe('/removeAll/collection/doc'+2+'.txt').result();
    }, done).
    then(function(document) {
      document.should.be.ok;
      document.exists.should.eql(false);
      done();
      }, done);
  });
  it('should remove the directory', function(done){
    this.timeout(5000);
    db.removeAll({directory:'/removeAll/directory'}).
    result(function(result) {
      return db.probe('/removeAll/directory/doc'+1+'.txt').result();
      }, done).
    then(function(document) {
      document.should.be.ok;
      document.exists.should.eql(false);
      return db.probe('/removeAll/directory/doc'+2+'.txt').result();
    }, done).
    then(function(document) {
      document.should.be.ok;
      document.exists.should.eql(false);
      done();
      }, done);
  });
  it('should remove all', function(done){
    this.timeout(9000);
    restAdminDB.removeAll({all:true}).
    result(function(result) {
      return db.probe('/removeAll/all/doc'+1+'.txt').result();
      }, done).
    then(function(document) {
      document.should.be.ok;
      document.exists.should.eql(false);
      return db.probe('/removeAll/all/doc'+2+'.txt').result();
    }, done).
    then(function(document) {
      document.should.be.ok;
      document.exists.should.eql(false);
      done();
      }, done);
  });
});

