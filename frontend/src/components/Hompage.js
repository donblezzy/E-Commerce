import React, { useEffect } from 'react'
import MetaData from './layout/MetaData'
import ProductItem from './product/ProductItem'
import { useGetProductsQuery } from "../redux/api/productApi"
import Loader from './layout/Loader'
import toast from 'react-hot-toast'

const Hompage = () => {

    const { data, isLoading, error, isError } = useGetProductsQuery()
    
    useEffect(() => {
      if (isError) {
        toast.error(error?.data?.message)
      }
    }, [isError])

    if (isLoading) return <Loader />

  return (
    <>
    <MetaData title={"Buy Best Products Online"} />
    <div className="container">
      <div className="row">
        <div className="col-12 col-sm-6 col-md-12">
          <h1 id="products_heading" className="text-secondary">Latest Products</h1>

          <section id="products" className="mt-0">
            <div className="row">
              {data?.products?.map((product) => (
                <ProductItem product={product} />
              ))}

              

            </div>
          </section>
        </div>
      </div>
    </div>
    </>
  )
}

export default Hompage