export type CatalogItem = {
  name: string;
  price: string;
  image: string;
};

export type CartItem = {
  name: string;
  unitPrice: number;
  qty: number;
  image: string;
};

export type ClientHomeData = {
  products: CatalogItem[];
  cartItems: CartItem[];
};

export const clientHomeData: ClientHomeData = {
  products: [
    {
      name: "The Onyx Burger",
      price: "$28.00",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAy2M0EO8QSjAn83DZ5ulE703qjgmVPaQK_ecWe10MD2an628SlGh2vkOxDlPIvQB8-iyLZvKKozTCeBM_K66cFzBmaoFEstrbPuqGggawRCw9v16d9o4AXc0NIyggm68M0b4vZJpqWqyjjr05xOnIcMBujmt-Lp9HAP9Vp9mzhcHC97IMvIlSfBRWNS276eXjvkoDmyvPUTAX9QF1dfL8VB8GjyECXAwuM7EqKih4lxo6rNebSV0MdTFSDw-8JFhbUMtEvLavTbg",
    },
    {
      name: "Luminous Toast",
      price: "$16.00",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAXyTUqfqK0aknpNt6xaqVsB814ZYXTbhVDIZaRsa33jvBYsXG7pYEG1OJcpfgWjkBHjSPgzy5xDHyrUoLtFU-76eYNT9BU21_2Mp7bxjvCXVyC937kK-ld3lJFfW_Ia8aj3T9p_tg6eW8wkju2ZTqUDBuFlXW2flJBrX-KaAf8-qKe-iqovFcHwZTuY5Owjzbj-fsC7SzaiBD6nTrBt7ZbJ2oOXpAFOY0fpqUEO6NccQlHuP-pAgoAO65ic4JL9jhA90YdCn6Tgg",
    },
    {
      name: "Truffle Reserve Mac",
      price: "$19.00",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCm7NECFuPO9S3Owje-Ny1c2WtB0QkvNRQst5BEkLQkpQPbRWjl9u5d6KoGT5zev059Vc4-7i5T-U3CNHe_olj-VoQuH0an95wR3AaopW5CR8vKgeviI6F7JXeuhtsxSUX_XcUfhMzgPyMqTcYe9vWX75z7mtcpPhezIbreAxrfvs4JJB2UkUSTN2hexMMv-RYc37RJMDYIYMgcfoSLspS_CiELVfPIoAGENUH2MmIWSpCcFVWZ-5qKSfKSf-zMjr4t4ygx_UYJ6w",
    },
    {
      name: "Kinetic Scallops",
      price: "$24.50",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBlUoFWHJfis-k37S7Ef7VjnOBfWwyDE7VTXS1aOD5E25Y3tZSPkDa6PitH3Lr8jSePOkU-7qfFCn4aoAEKKH7p39Z-tXVwCOkthcfS4oMZcTYQ74-zNoL5dLdhXlnDtFWzsI51SkJivVtm1S2zDS2yYXpVYvloRolT9BITTI_GS3ZVEWZjL5FJg0b8UOHENDrVxqYshrlDAgeGlUU5RSS_OXLEd7r5BMu20VumQoIaZNS0WFjtyWMRWPbOPeWv_AfzOyr-IMKynQ",
    },
    {
      name: "Neon Mochi Plate",
      price: "$12.00",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuD_VQ7ASbZnb_K6j23t5eIRkuxCByDIOprqP9rjmi5aa5djyILCL9CZUU2vvaSyJQq0YFKlBVoZeny9cFhZ8I4ZeQnxCWzi44opLK7upY2UnVUHkVgVsHity7gH6ZZGWdqhefpIiFt02pL3a0ngOt4z7UWu238YL80s2qid4NKoHu10YrTyHlmwoPxwL7skdCt7zgJGQG0iJ_mlfpVBKsNnV298V-2KvLp62ZPMxcn5cPdMjUDAJOYjkpVRifEq7GL8GqQkjx-m2g",
    },
  ],
  cartItems: [
    {
      name: "Onyx Burger",
      unitPrice: 18.5,
      qty: 1,
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCQpyiuucfe9yQi66UdgKK9oJUI_tbucNeqHQFxIaGEatzns4WJ6__ZP7aoGHN7gFfMSX0dWJAWHYt4PYolp-RDxdUK4XZjCu0-w1a-OnzkWxk4EGs9BoNYY19eXyaPT_PZSWa8jZRQiaw0NdDS8Wz0rTvol_Y_hvkHYn5OyVlX4XXi5FR8xNRiV82iJuxYz7UBrGnjd8z8rC4LKzKTvOp2LvrziF7rkJyUdymKYTw4QTlx-0rT4E6xTPuNGZXTwqkmZNPhknFHww",
    },
    {
      name: "Neon Mochi Plate",
      unitPrice: 12,
      qty: 2,
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAo90IQz8hBE_reYwIbDavV2jXHeEcHMVEg63w6zte38eRyUF9kDyem9qZgazNqebCHVTBkP5YCSK5hW7jiTXYnR4U4afh_2dW44TsSAbBmUFvXeSGoomrh_spLToLjgAgkpqjnQy5U7OWCdlRHnbQFTmM-YFutguny5VAgEZBrG0Efn7XE2e_8XpvnCi_BaaN5ELe1f_hZYXOTCgLm3VyPB350TvA_M371s-ZZBUXvrj1eQaQ_HE8dFIQsa6jYLSLXEZWQ8YWxtA",
    },
  ],
};