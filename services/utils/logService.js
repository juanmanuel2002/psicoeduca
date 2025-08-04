import admin from 'firebase-admin';

function toBase64(obj) {
  return Buffer.from(JSON.stringify(obj)).toString('base64');
}

export function logAfterResponse(action) {
  return (req, res, next) => {
    res.on('finish', () => {
      const resBody = res.locals && res.locals.responseBody ? res.locals.responseBody : {};
      saveLog({ req, resBody, action,  statusCode: res.statusCode }).catch(err => {
        console.error(`[${action}] Error guardando log:`, err);
      });
    });

    next();
  };
}


export async function saveLog({ req, resBody, action, statusCode  }) {
  try {
    const log = {
      timestamp: new Date(),
      user: req.user ? req.user.uid : null,
      action,
      path: req.originalUrl,
      method: req.method,
      code: statusCode,
      body: toBase64(req.body),
      response: toBase64(resBody),
      ip: req.ip
    };
    await admin.firestore().collection('logs').add(log);
  } catch (error) {
    console.error('Error guardando log:', error.message);
  }
}
