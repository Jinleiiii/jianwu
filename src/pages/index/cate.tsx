import Taro from '@tarojs/taro'
import React, {useEffect, useState} from 'react'
import './index.scss'
import { View, Text, Image } from '@tarojs/components'
interface Category {
  _id: string;
  name: string;
  categoryImage: string[];
}

async function fetchCategories() {
  const res = await Taro.request({
    url: 'http://localhost:3000/categories',
    method: 'GET',
    header: {
      'content-type': 'application/json'
    },
  });

  if (res.statusCode === 200) {
      return res.data;
    } else {
      throw new Error('服务器错误，状态码：' + res.statusCode)
    }
}

export default function CateContent() {
  const [categories, setCategories] = useState<Category[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchCategories();
      setCategories(data);
    };
    fetchData();
  }, []);

    return (
      <View>
    <View className='categories-container'>
      {categories.map((category) => (
        <View key={category._id} className='category-item'>
          <Image
            style={{ width: '100%', height: '100px' }} 
            src={category.categoryImage[0]}
            mode='aspectFill'
          />
          <Text>{category.name}</Text>
        </View>
      ))}
    </View>
      </View>
  )
}
