import * as assert from 'assert';
import { setupHapi, connectToMongo } from '../src/index';
import * as Mongoose from 'mongoose';
import { RouteHandler } from '../src/services/RouteHandler';
import { RESTifier } from '../src/services/RESTifier';
import { HobbyModel, HobbyValidators } from '../src/entities/Hobby';
import { UserModel, UserValidators } from '../src/entities/User';

describe('STARTUP TESTS', async () => {
  let server;
  describe('[TEST 1] - Hapi instance creation', async () => {
    it('should not throw any error', async () => {
      server = await setupHapi();
      assert.ok(server, 'server is not null');
    });
  });

  describe('[TEST 2] - Mongo connection is done', async () => {
    it('connection object should not be null', async () => {
      connectToMongo();
      setTimeout(() => {
        assert.ok(Mongoose.connection, 'mongo connection is not null after 200ms')
      }, 200);
    });
  });

  describe('[TEST 3] - Routing is correctly set', async () => {
    let routeHandler;
    it('RouteHandler object is correctly instantiated', async () => {
      routeHandler = new RouteHandler(server);
      assert.ok(routeHandler);
    });
    it('can create a custom endpoint', async () => {
      routeHandler.addRouteObject({
        method: 'GET',
        path: '/test',
        handler: () => console.log("testing")
      });
    it('RESTifier correctly creates APIs with no errors', async () => {
      const restifier = new RESTifier(routeHandler);
      assert.ok(restifier);
      restifier.RESTifyModel({ model: HobbyModel, validators: HobbyValidators });
      restifier.RESTifyModel({ model: UserModel, validators: UserValidators });
    })
    })
  });

});
