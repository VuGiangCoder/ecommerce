const db = require('../models/index');
const RESPONSE = require('../schema/response');
const image = require('../service/image');

const sellerController = {
  async getDetailShop(req, res) {

  },
  async addItem(req, res) {

  },
  async removeItem(req, res) {
    //change quantity = - 1, not show and search in client
  },
  async updateItem(req, res) {

  },
  async updateInfoShop(req, res) {

  },
  getListOrder(req, res) {

  },
  getListComment(req, res) {
    //for item or for all
  },
  updateOrder(req, res) {

  },
  addPromotion(req, res) {

  },
  toggleItemOnPromotion(req, res) {

  },
  getListClientBuy(req, res) {

  },
  createShop(req, res) {

  },
  removeShop(req, res) {
    // set state shop = close
  }
}

module.exports = sellerController;