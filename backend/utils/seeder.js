import mongoose from 'mongoose'
import productModel from '../models/productModel.js'
import userModel from '../models/userModel.js'
import { v2 as cloudinary } from 'cloudinary'
import path from 'path'
import fs from 'fs'
import dotenv from 'dotenv'

// LOAD ENV
dotenv.config({ path: 'config/config.env' })

console.log('DB_LOCAL_URI:', process.env.DB_LOCAL_URI)

// CLOUDINARY CONFIG
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const uploadImageToCloudinary = async (imagePath) => {
  const fileName = imagePath.split('/').pop()

  const localPath = path.resolve(
    process.cwd(),
    '../frontend/public/images/products',
    fileName
  )

  const result = await cloudinary.uploader.upload(localPath, {
    folder: 'products',
  })

  return {
    image: result.secure_url,
    public_id: result.public_id,
  }
}

const seedProducts = async () => {
  try {
    console.log('🔗 Connecting to MongoDB...')
    await mongoose.connect(process.env.DB_LOCAL_URI)

    console.log('🧹 Clearing products...')
    await productModel.deleteMany({})

    const adminUser = await userModel.findOne({ role: 'admin' })

    if (!adminUser) {
      throw new Error('No admin user found. Create admin first.')
    }

    const data = fs.readFileSync(
      path.resolve('data/products.json'),
      'utf-8'
    )

    const products = JSON.parse(data)
    const finalProducts = []

    for (const product of products) {
      const uploadedImages = []

      for (const img of product.images) {
        uploadedImages.push(
          await uploadImageToCloudinary(img.image)
        )
      }

      finalProducts.push({
        name: product.name,
        price: product.price,
        description: product.description,
        ratings: product.ratings,
        images: uploadedImages,
        category: product.category,
        seller: product.seller,
        stock: product.stock,
        numOfReviews: product.numOfReviews,
        reviews: product.reviews,
        user: adminUser._id,
        createdAt: product.createdAt || Date.now(),
      })
    }

    await productModel.insertMany(finalProducts)

    console.log('✅ PRODUCTS SEEDED SUCCESSFULLY')
    process.exit(0)

  } catch (err) {
    console.error('❌ SEED ERROR:', err.message)
    process.exit(1)
  }
}

seedProducts()
