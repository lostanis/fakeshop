const sampleSize = require('lodash.samplesize')

const categories = [
  {
    id: 'home',
    cTitle: 'Home',
    cName: 'Home',
    cSlug: 'home',
    cMetaDescription: 'Мета описание',
    cDesc: 'Описание',
    cImage: 'https://source.unsplash.com/300x300/?home',
    products: []
  },
  {
    id: 'garden',
    cTitle: 'Garden',
    cName: 'Garden',
    cSlug: 'garden',
    cMetaDescription: 'Мета описание',
    cDesc: 'Описание',
    cImage: 'https://source.unsplash.com/300x300/?garden',
    products: []
  },
  {
    id: 'school',
    cTitle: 'School',
    cName: 'School',
    cSlug: 'school',
    cMetaDescription: 'Мета описание',
    cDesc: 'Описание',
    cImage: 'https://source.unsplash.com/300x300/?school',
    products: []
  },
  {
    id: 'garage',
    cTitle: 'BuGaragells',
    cName: 'Garage',
    cSlug: 'garage',
    cMetaDescription: 'Мета описание',
    cDesc: 'Описание',
    cImage: 'https://source.unsplash.com/300x300/?garage',
    products: []
  }
]

function getProductsByIds (products, productsImages, ids) {
  const innerProducts = products.filter(p => p.id === ids.find(id => p.id === id))
  if (!innerProducts) return null
  return innerProducts.map(pr => {
    return {
      ...pr,
      images: productsImages.find(img => img.id === pr.id).urls,
      category: categories.find(cat => cat.id === pr.category_id)
    }
  })
}

function getProduct (products, productsImages, productSlug) {
  const innerProduct = products.find(p => p.pSlug === productSlug)
  if (!innerProduct) return null
  return {
    ...innerProduct,
    images: productsImages.find(img => img.id === innerProduct.id).urls,
    category: categories.find(cat => cat.id === innerProduct.category_id)
  }
}

function addProductsToCategory (products, productsImages, category) {
  const categoryInner = { ...category, products: [] }
  products.map(p => {
    if (p.category_id === category.id) {
      categoryInner.products.push({
        id: p.id,
        pName: p.pName,
        pSlug: p.pSlug,
        pPrice: p.pPrice,
        image: productsImages.find(img => img.id === p.id).urls
      })
    }
  })
  return categoryInner
}

function getBreadcrumbs (pageType, route, data) {
  const crumbs = []
  crumbs.push({
    title: 'Main',
    url: '/'
  })
  switch (pageType) {
    case 'category':
      crumbs.push({
        title: data.cName,
        url: `/category/${data.cSlug}`
      })
      break
    case 'product':
      crumbs.push({
        title: data.category.cName,
        url: `/category/${data.category.cSlug}`
      })
      crumbs.push({
        title: data.pName,
        url: `/product/${data.pSlug}`
      })

      break

    default:
      break
  }
  return crumbs
}

export default { categories, sampleSize, getProductsByIds, getProduct, addProductsToCategory, getBreadcrumbs }
