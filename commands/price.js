const poring = require('./../lib/poring.js');

module.exports = {
  name: 'price',
  alias: '^price$',
  description: 'Item Prices',
  async execute(message, args){
    poring.getPrice(args.join(' ')).catch(err=>console.log(err));
  }
};
