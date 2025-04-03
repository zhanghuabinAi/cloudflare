// ip-optimizer-worker.js

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  // 获取客户端信息
  const clientIP = request.headers.get('CF-Connecting-IP')
  const clientCountry = request.headers.get('CF-IPCountry')
  const clientASN = request.headers.get('CF-Connecting-ASN')
  
  // 检查客户端是否来自中国并且特别是中国移动
  const isChinaMobile = clientCountry === 'CN' && 
                        (clientASN === '9808' || // 中国移动
                         clientASN === '56040' || // 中国移动
                         clientASN === '56041') // 中国移动国际
  
  // 获取针对中国移动优化的Cloudflare边缘节点
  // 这些是示例 - 您应该测试哪些IP效果最好
  const optimizedIPs = {
    primary: isChinaMobile ? '104.17.32.0/24' : '104.16.132.229',
    secondary: isChinaMobile ? '104.18.7.41' : '104.17.186.111',
    tertiary: isChinaMobile ? '104.16.160.3' : '104.18.14.101'
  }
  
  // 返回优化的IP信息
  return new Response(JSON.stringify({
    clientInfo: {
      ip: clientIP,
      country: clientCountry,
      asn: clientASN,
      isChinaMobile
    },
    optimizedEndpoints: optimizedIPs,
    timestamp: new Date().toISOString()
  }), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'max-age=3600'
    }
  })
}
