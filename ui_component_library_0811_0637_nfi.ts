// 代码生成时间: 2025-08-11 06:37:47
import React from 'react';
import { gql, useQuery } from '@apollo/client';

// GraphQL 查询语句，用于获取组件数据
const COMPONENTS_QUERY = gql`
  query GetUIComponents {
    components {
      id
      name
      description
    }
  }
`;

// 基础组件接口
interface IComponent {
  id: string;
  name: string;
  description: string;
}

// UIComponents 组件，用于展示所有组件
const UIComponents: React.FC = () => {
  const { data, loading, error } = useQuery<{ components: IComponent[] }>(COMPONENTS_QUERY);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  return (
    <div>
      <h1>UI Components</h1>
      {data && data.components.map(component => (
        <div key={component.id}>
          <h2>{component.name}</h2>
          <p>{component.description}</p>
        </div>
      ))}
    </div>
  );
};

export default UIComponents;