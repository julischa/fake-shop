/* eslint-disable react-hooks/exhaustive-deps */
import NavBar from "@/components/NavBar";
import styles from "@/styles/homepage.module.css";
import Link from "next/link";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { Product } from "@/types";
import Footer from "@/components/Footer";
import Loader from "@/components/Loader";
import { ProductContext } from "@/contexts/ProductContext";

export default function Home() {
  const [selectedProducts, setSelectedProducts] = useState<Product[]>();
  const { loader, setLoader } = useContext(ProductContext);

  const getProductsById = async (ids: string[]) => {
    const selectedById: any = await Promise.all(
      ids.map(async (id) => {
        const url = `/api/product-by-id?id=${id}`;

        const reponses = await fetch(url);
        const results = await reponses.json();
        return results;
      })
    );
    setSelectedProducts(selectedById);
    setLoader(false);
  };

  useEffect(() => {
    const ids = ["11", "4", "17"];
    getProductsById(ids);
  }, []);
  return (
    <>
      <NavBar />
      {loader ? (
        <Loader />
      ) : (
        <div id="content">
          {selectedProducts && (
            <div className={styles.cardContainer}>
              <div
                className={`${styles.card} ${styles.cardBig}`}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Link href={`/product/${selectedProducts[0].internal_id}`}>
                  <Image
                    alt={selectedProducts[0].name}
                    title={selectedProducts[0].name}
                    src={selectedProducts[0].image}
                    width={420}
                    height={420}
                    className={`${styles.cardLogo}`}
                  />
                </Link>
                <button className={styles.exploreButton}>
                  Explore Products
                </button>
              </div>
              <div
                className={styles.card}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Link href={`/product/${selectedProducts[1].internal_id}`}>
                  <Image
                    alt={selectedProducts[1].name}
                    title={selectedProducts[1].name}
                    src={selectedProducts[1].image}
                    width={320}
                    height={320}
                    className={`${styles.cartLogo}`}
                  />
                </Link>
              </div>
              <div
                className={styles.card}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Link href={`/product/${selectedProducts[2].internal_id}`}>
                  <Image
                    alt={selectedProducts[2].name}
                    title={selectedProducts[2].name}
                    src={selectedProducts[2].image}
                    width={320}
                    height={320}
                    className={`${styles.cartLogo}`}
                  />
                </Link>
                <Link href="/products">
                  <button className={styles.exploreButton}>
                    Explore Products
                  </button>
                </Link>
              </div>
            </div>
          )}
          <div className={styles.loremIpsum}>
            Explore our diverse collection of kitchen appliance tools, designed
            to elevate your cooking experience to new heights. Made in Berlin.
          </div>
          <div className={styles.titleContainer}>
            <p className={styles.title}>
              Discover a wide range of kitchen appliance tools
            </p>
            <div className={styles.discoverContainer}>
              <Link href="/products" className={styles.discover}>
                <span className={styles.discoverText}>Discover →</span>
              </Link>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
}
