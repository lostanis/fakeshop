import mock from '../utils/mockServer'

const findMax = (array, field) => {
  if (!array || array.lenght === 0) return 1
  return Math.max(...array.map(o => o[field]), 0)
}

// const sleep = m => new Promise(r => setTimeout(r, m))

export const state = () => ({
  products: [], // product { qty, productId, order }
  metaProducts: [],
  version: '0.0.4'
})

export const mutations = {
  ADD_PRODUCT (state, productId) {
    // if cart doesn't have product add it
    if (!state.products.find(p => productId === p.productId)) {
      state.products = [...state.products, { productId: productId, qty: 1, order: findMax(state.products, 'order') + 1 }]
    }
  },

  REMOVE_PRODUCT (state, productId) {
    state.products = Array.from(state.products.filter(prod => prod.productId !== productId))
  },

  SET_PRODUCT_QTY (state, { productId, qty }) {
    state.products = [
      ...state.products.filter(prod => prod.productId !== productId),
      { ...state.products.find(prod => prod.productId === productId), qty }
    ]
  },

  SET_PRODUCTS_BY_IDS (state, products) {
    state.metaProducts = products
  }
}

export const getters = {
  getProductsInCart: state => {
    const products = []
    state.products.map(p => {
      const metaProduct = state.metaProducts.find(mp => mp.id === p.productId)
      if (metaProduct) {
        products.push({ ...p, meta: metaProduct })
      }
    })
    return products.sort((a, b) => a.order - b.order)
  }
}

export const actions = {
  async setProductsListByIds ({ commit, state }) {
    const [products, productsImages] = await Promise.all(
      [
        fetch('/mock/products.json'),
        fetch('/mock/products-images.json')
        // this.$axios.$get('/mock/products.json'),
        // this.$axios.$get('/mock/products-images.json')
      ]
    )
    const productsIds = state.products.map(p => p.productId)
    await commit('SET_PRODUCTS_BY_IDS', mock.getProductsByIds(products, productsImages, productsIds))
  },

  async addProduct ({ commit, dispatch }, productId) {
    await commit('ADD_PRODUCT', productId)
    await dispatch('setProductsListByIds')
  },

  async removeProduct ({ commit, dispatch }, productId) {
    await commit('REMOVE_PRODUCT', productId)
    await dispatch('setProductsListByIds')
  },

  async setProductQuantity ({ commit, dispatch }, { productId, qty }) {
    await commit('SET_PRODUCT_QTY', { productId, qty })
    await dispatch('setProductsListByIds')
  }
}
