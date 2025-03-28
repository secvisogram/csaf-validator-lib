import Ajv from 'ajv/dist/jtd.js'
import { cvss30, cvss31 } from '../../lib/shared/first.js'
import * as cvss2 from '../../lib/shared/cvss2.js'
import * as cvss3 from '../../lib/shared/cvss3.js'

const ajv = new Ajv()

const inputSchema = /** @type {const} */ ({
    additionalProperties: true,
    properties: {
        vulnerabilities: {
            elements: {
                additionalProperties: true,
                optionalProperties: {
                    product_status: {
                        additionalProperties: true,
                        optionalProperties: {
                            fixed: {
                                elements: { type: 'string' },
                            },
                            first_fixed: {
                                elements: { type: 'string' },
                            },
                        },
                    },
                    metrics: {
                        elements: {
                            additionalProperties: true,
                            optionalProperties: {
                                content: {
                                    additionalProperties: true,
                                    optionalProperties: {
                                        cvss_v4: {
                                            additionalProperties: true,
                                            optionalProperties: {
                                                environmentalScore: { type: 'float64' },
                                                vectorString: { type: 'string' },
                                                version: { type: 'string' },
                                            },
                                        },
                                        cvss_v3: {
                                            additionalProperties: true,
                                            optionalProperties: {
                                                environmentalScore: { type: 'float64' },
                                                vectorString: { type: 'string' },
                                                version: { type: 'string' },
                                            },
                                        },
                                        cvss_v2: {
                                            additionalProperties: true,
                                            optionalProperties: {
                                                environmentalScore: { type: 'float64' },
                                                vectorString: { type: 'string' },
                                                version: { type: 'string' },
                                            },
                                        },
                                    }
                                },
                                products: {
                                    elements: { type: 'string' },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
})
const validateInput = ajv.compile(inputSchema)

/**
 * @param {any} doc
 */
export function optionalTest_6_2_19(doc) {
    const ctx = {
        warnings:
        /** @type {Array<{ instancePath: string; message: string }>} */ ([]),
    }

    if (!validateInput(doc)) {
        return ctx
    }

    doc.vulnerabilities.forEach((vulnerability, vulnerabilityIndex) => {
        const fixedProductIDs = new Set([
            ...(vulnerability.product_status?.first_fixed ?? []),
            ...(vulnerability.product_status?.fixed ?? []),
        ])
        for (const productID of fixedProductIDs) {
            vulnerability.metrics?.forEach((metric, metricIndex) => {
                if (!metric.products?.includes(productID)) return
                const content = metric.content;
                if (content !== undefined){
                    if (content.cvss_v4){
                        checkCVSS(content, 'cvss_v4', ctx, vulnerabilityIndex, metricIndex, productID)
                    }
                    if (content.cvss_v3){
                        checkCVSS(content, 'cvss_v3', ctx, vulnerabilityIndex, metricIndex, productID)
                    }
                    if (content.cvss_v2){
                        checkCVSS(content, 'cvss_v2', ctx, vulnerabilityIndex, metricIndex, productID)
                    }
                }
            })
        }
    })

    return ctx
}

/**
 * @param {{} & { cvss_v4?: ({} & { enviralScore?: number | undefined; vectorString?: string | undefined; version?: string | undefined; } & Record<string, unknown>) | undefined; cvss_v3?: ({} & { environmentalScore?: number | undefined; vectorString?: string | undefined; version?: string | undefined; } & Record<string, unknown>) | undefined; cvss_v2?: ({} & { environmentalScore?: number | undefined; vectorString?: string | undefined; version?: string | undefined; } & Record<string, unknown>) | undefined; } & Record<string, unknown>} content
 * @param {string} type
 * @param {{warnings: any;}} ctx
 * @param {number} vulnerabilityIndex
 * @param {number} metricIndex
 * @param {string} productID
 */
function checkCVSS(content, type, ctx, vulnerabilityIndex, metricIndex, productID) {
    if (!content || !content[type]) return;
    const cvss = /** @type {{ environmentalScore?: number; vectorString?: string; version?: string }} */ (content[type]);
    const calculatedValue = cvss.version === '3.1' || cvss.version === '3.0' || cvss.version === '2.0'
        ? calculateEnvironmentalScoreFromMetrics({
            version: cvss.version,
            vectorString: cvss.vectorString ?? '',
            metrics: cvss,
        })
        : null;
    if (
        (typeof cvss.environmentalScore === 'number' && cvss.environmentalScore > 0) ||
        (typeof calculatedValue === 'number' && calculatedValue > 0) ||
        calculatedValue === null
    ) {
        ctx.warnings.push({
            instancePath: `/vulnerabilities/${vulnerabilityIndex}/metrics/${metricIndex}/${type}`,
            message: `environmental score should be 0 since "${productID}" is listed as fixed`,
        });
    }
}

const cvss2Mapping =
    /** @type {ReadonlyArray<readonly [string, string, Record<string, string>]>} */ (
    cvss2.mapping.map((mapping) => [
        mapping[0],
        mapping[1],
        Object.fromEntries(
            Object.entries(mapping[2]).map(([key, value]) => [key, value.id])
        ),
    ])
)

const cvss3Mapping = cvss3.mapping

/**
 * @param {object} params
 * @param {'2.0' | '3.0' | '3.1' | '4.0'} params.version
 * @param {string} params.vectorString
 * @param {Record<string, unknown>} params.metrics
 */
function calculateEnvironmentalScoreFromMetrics({
                                                    version,
                                                    vectorString,
                                                    metrics,
                                                }) {
    const vectorFromVectorString = new Map(
        vectorString
            .split('/')
            .map((e) => {
                const [key, value] = e.split(':')
                return /** @type {const} */ ([key, value])
            })
            .filter(([, value]) => value)
    )
    if (version === '3.1' || version === '3.0') {
        const args = /**
         * @type {[
         *   string,
         *   string,
         *   string,
         *   string,
         *   string,
         *   string,
         *   string,
         *   string,
         *   string,
         *   string,
         *   string,
         *   string,
         *   string,
         *   string,
         *   string,
         *   string,
         *   string,
         *   string,
         *   string,
         *   string,
         *   string,
         *   string,
         * ]}
         */ (
            calculateMetricArray({
                mapping: cvss3Mapping,
                metrics,
                vector: vectorFromVectorString,
            }).map((e) => e[1])
        )
        const metric = (
            version === '3.1' ? cvss31 : cvss30
        ).calculateCVSSFromMetrics(...args)
        if (!metric.success) return null
        return Number(metric.environmentalMetricScore)
    } else {
        const vector = Object.fromEntries(
            calculateMetricArray({
                mapping: cvss2Mapping,
                metrics,
                vector: vectorFromVectorString,
            })
        )
        const metric = safelyParseCVSSV2Vector(vector)
        if (!metric.success) return null
        return metric.environmentalMetricScore
    }
}

/**
 * This function takes a cvss vector and a metric object and extracts all cvss
 * values according to the mapping. It does this by first looking up every property
 * in the `vector`. If the property doesn't exist there but in the metrics objects,
 * it takes the value from the corresponding metrics object.
 *
 * @param {object} params
 * @param {Map<string, string>} params.vector
 * @param {Record<string, unknown>} params.metrics
 * @param {ReadonlyArray<readonly [string, string, Record<string, string>]>} params.mapping
 * @returns an array of pairs where the first element is the metric name (abbreviated) and the
 *    second is the value (abbreviated). If no value is found the value is `undefined`.
 *    The order of the array is the same as in the mapping.
 */
function calculateMetricArray({ vector, metrics, mapping }) {
    return mapping.map((e) => {
        const metricAbbrev = e[1]
        const metricPropertyName = e[0]
        /** @type {any} */
        const metricValueAbbrevMap = e[2]
        /** @type {any} */
        const metricValue = metrics[metricPropertyName]
        return [
            metricAbbrev,
            vector.get(metricAbbrev) ?? metricValueAbbrevMap[metricValue],
        ]
    })
}

/**
 * @param {string | {}} vectorString
 * @returns
 */
function safelyParseCVSSV2Vector(vectorString) {
    try {
        return {
            success: true,
            environmentalMetricScore:
                cvss2.getEnvironmentalScoreFromVectorString(vectorString),
        }
    } catch (e) {
        return {
            success: false,
            environmentalMetricScore: -1,
        }
    }
}
