'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    // password: 'password'
    return queryInterface.bulkInsert('Users', [{
      email: 'foo@bar.baz',
      hash: 'KvhqrSIpFK6AKhHoSwhbTSumCdtGw4CwY1lC61i1BqFQDiC5fjtXG3uZrF7tzbWalSf6VCJhzrFaxYOSTMCCYWZHVgLQ8JvtfZWy49OktFfKpdBE4NZKpAw2iDys8fYWHx/udb0dZ2xc7LpaCdkLAdVQO38/tovEnl2LRpo3QDI=',
      salt: 'xs1WYwNjLjnTjVyyFxk8EV7F7Mzc4x+U9BstPJb5foHqwJtqmmiexXacx9YPA0InfuKp5BPSebpGOXrOHZUVyg==',
      createdAt: new Date().toISOString().replace('T', ' ').replace('Z', ''),
      updatedAt: new Date().toISOString().replace('T', ' ').replace('Z', '')
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
