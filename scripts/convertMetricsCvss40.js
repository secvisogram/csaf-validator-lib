//convert https://github.com/RedHatProductSecurity/cvss-v4-calculator/blob/main/metrics.json into a flat metric object

import fs from 'node:fs'
import { readFile } from 'fs/promises'

const metricsJson1 = JSON.parse(
  await readFile('./metrics.json', { encoding: 'utf-8' })
)

console.log('start tests')

const flatMetrics = []

for (const [metricType, metricTypeData] of Object.entries(metricsJson1)) {
  for (const [metricGroup, metricGroupData] of Object.entries(
    metricTypeData.metric_groups
  )) {
    for (const [metric, metricData] of Object.entries(metricGroupData)) {
      console.log(metricData.short)
      const flatMetric = {
        metricType: metricType,
        metricGroup: metricGroup,
        jsonName: metric,
        metric: metric,
        metricShort: metricData.short,
        options: [],
      }
      for (const [option, optionData] of Object.entries(metricData.options)) {
        console.log(option)
        const flatOption = {
          optionName: option,
          optionValue: optionData.value,
        }
        // @ts-ignore
        flatMetric.options.push(flatOption)
      }
      // @ts-ignore
      flatMetric['initialOption'] = flatMetric.options[0].optionValue
      flatMetrics.push(flatMetric)
    }
  }
}

console.log(flatMetrics)
fs.writeFile('cvss40FlatMetric.json', JSON.stringify(flatMetrics), (err) => {
  if (err) {
    console.log(err)
  }
})

console.log('finished Write file')
