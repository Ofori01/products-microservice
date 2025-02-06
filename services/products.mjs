import mongoose from "mongoose";
import ProductModel from "../model/productsSchema.mjs";
import deleteFromGridFS from "../utils/deleteFromBucket.mjs";
import uploadToGridFS from "../utils/imageUploader.mjs";

async function addProduct(seller_id, title, description, price, stock_quantity, category,imageId){
    try {
        const newProduct = new ProductModel({seller_id, title, description, price, stock_quantity, category, image_url: imageId});
        return await newProduct.save();
    } catch (error) {
        throw error;
    }

}

async function updateProduct(product_id,product){
    try {
        if(product.image_url){
            const {image_url} = await ProductModel.findOne({product_id});
            if(image_url){
                try {
                await deleteFromGridFS(image_url);
                } catch (error) {
                    throw error;
                }
            }
            console.log(product.image_url)
            product.image_url = await uploadToGridFS(product.image_url);
        }
        const updatedProduct = await ProductModel.findOneAndUpdate({product_id},product,{new:true});
        return updatedProduct
    } catch (error) {
        throw error;
    }
}

async function deleteProduct(productId){
    try {
        const product_id = new mongoose.Types.ObjectId(productId); 
        const deletedProduct=  await ProductModel.findOneAndDelete({product_id: product_id});
        ProductModel.de
        return deletedProduct;
    } catch (error) {
        throw error;
    }
}

async function getProducts(){
    try {
        return await ProductModel.find();
    } catch (error) {
        throw error;
    }
}

async function getProduct(product_id){
    try {
       return await ProductModel.findOne({product_id});
    }
    catch (error) {
        throw error;
    }
}

async function getTopProductsService(){
    try {
        return await ProductModel.find().sort({ratings:-1}).limit(4);
    } catch (error) {
        throw error;
    }
}

async function getProductByCategory(category){
    try {
        return await ProductModel.find({category});
    } catch (error) {
        throw error;
    }
}

async function getAvailableCategories(){
    try {
        let categories = await ProductModel.find({},{category:1})
        categories = [...new Set(categories.map((product)=> product.category))]
        return categories

    } catch (error) {
        throw error
        
    }
}

function getAllCategories(){
        return  ["Electronics", "Clothing", "Books", "Home & Kitchen", "Beauty & Health", "Sports & Outdoors", "Toys & Games", "Others"]
}

async function getProductsBySeller(seller_id){
    try {
        return await ProductModel.find({seller_id});
    } catch (error) {
        throw error;
    }
}

async function deleteSellersProducts(seller_id){
    try {
        const deletedProducts = await ProductModel.deleteMany({seller_id})
        return deletedProducts
    } catch (error) {
        throw error
    }
}




export {addProduct,updateProduct,deleteProduct,getProducts,getProduct,getProductByCategory, getAvailableCategories, getAllCategories, getProductsBySeller,getTopProductsService, deleteSellersProducts};