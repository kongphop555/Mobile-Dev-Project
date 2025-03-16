import React from 'react';
import { VictoryPie } from 'victory-native';

const PieChart = ({ data }) => (
  <VictoryPie
    data={data}
    colorScale={['#6200ee', '#03dac6', '#ff0266', '#ffde03']}
    innerRadius={50}
  />
);

export default PieChart;