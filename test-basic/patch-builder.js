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
var assert = require('assert');
var should = require('should');
var p = require('../lib/patch-builder.js');

describe('patch-builder', function() {
  it('should create an insert operation', function(){
    assert.deepEqual(
        p.insert('/the/context', 'last-child', 'the content'),
        {insert:{
          context:  '/the/context',
          position: 'last-child',
          content:  'the content'
          }}
        );
    assert.deepEqual(
        p.insert('/the/context', 'before', 'the content'),
        {insert:{
          context:  '/the/context',
          position: 'before',
          content:  'the content'
          }}
        );
    assert.deepEqual(
        p.insert('/the/context', 'after', 'the content'),
        {insert:{
          context:  '/the/context',
          position: 'after',
          content:  'the content'
          }}
        );
    assert.deepEqual(
        p.insert('/the/context', 'last-child', 'the content', '?'),
        {insert:{
          context:     '/the/context',
          position:    'last-child',
          content:     'the content',
          cardinality: '?'
          }}
        );
    assert.deepEqual(
        p.insert('/the/context', 'last-child', {key:'the value'}),
        {insert:{
          context:  '/the/context',
          position: 'last-child',
          content:  {key:'the value'}
          }}
        );
  });
  it('should create a replace operation', function(){
    assert.deepEqual(
        p.replace('/the/select', 'the content'),
        {replace:{
          select:  '/the/select',
          content: 'the content'
          }}
        );
    assert.deepEqual(
        p.replace('/the/select', 'the content', '?'),
        {replace:{
          select:      '/the/select',
          content:     'the content',
          cardinality: '?'
          }}
        );
    assert.deepEqual(
        p.replace('/the/select', {key:'the value'}),
        {replace:{
          select:  '/the/select',
          content:  {key:'the value'}
          }}
        );
    assert.deepEqual(
        p.replace('/the/select', p.multiplyBy(7)),
        {replace:{
          select:  '/the/select',
          content: [{"$value":7}],
          apply:   'ml.multiply'
          }}
        );
    assert.deepEqual(
        p.replace('/the/select', p.apply('functionName', 'the content')),
        {replace:{
          select:  '/the/select',
          content: [{"$value":"the content"}],
          apply:   'functionName'
          }}
        );
    assert.deepEqual(
        p.replace('/the/select', p.concatBefore('the content')),
        {replace:{
          select:  '/the/select',
          content: [{"$value":"the content"}],
          apply:   'ml.concat-before'
          }}
        );
  });
  it('should create a replace-insert operation', function(){
    assert.deepEqual(
        p.replaceInsert('/the/select', '/the/context', 'last-child', 'the content'),
        {'replace-insert':{
          select:   '/the/select',
          context:  '/the/context',
          position: 'last-child',
          content:  'the content'
          }}
        );
    assert.deepEqual(
        p.replaceInsert('/the/select', '/the/context', 'before', 'the content'),
        {'replace-insert':{
          select:   '/the/select',
          context:  '/the/context',
          position: 'before',
          content:  'the content'
          }}
        );
    assert.deepEqual(
        p.replaceInsert('/the/select', '/the/context', 'after', 'the content'),
        {'replace-insert':{
          select:   '/the/select',
          context:  '/the/context',
          position: 'after',
          content:  'the content'
          }}
        );
    assert.deepEqual(
        p.replaceInsert('/the/select', '/the/context', 'last-child', 'the content', '?'),
        {'replace-insert':{
          select:      '/the/select',
          context:     '/the/context',
          position:    'last-child',
          content:     'the content',
          cardinality: '?'
          }}
        );
    assert.deepEqual(
        p.replaceInsert('/the/select', '/the/context', 'last-child', {key:'the value'}),
        {'replace-insert':{
          select:   '/the/select',
          context:  '/the/context',
          position: 'last-child',
          content:  {key:'the value'}
          }}
        );
    assert.deepEqual(
        p.replaceInsert('/the/select', '/the/context', 'last-child',
            p.apply('functionName', 'the content')),
        {'replace-insert':{
          select:   '/the/select',
          context:  '/the/context',
          position: 'last-child',
          content:  [{"$value":"the content"}],
          apply:    'functionName'
          }}
        );
  });
  it('should create a delete operation', function(){
    assert.deepEqual(
        p.remove('/the/select'),
        {'delete':{
          select: '/the/select'
          }}
        );
    assert.deepEqual(
        p.remove('/the/select', '?'),
        {'delete':{
          select:      '/the/select',
          cardinality: '?'
          }}
        );
  });
});
