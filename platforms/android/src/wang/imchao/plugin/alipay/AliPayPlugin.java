package wang.imchao.plugin.alipay;

import android.app.AlertDialog;
import android.content.DialogInterface;
import android.text.TextUtils;

import com.alipay.sdk.app.EnvUtils;
import com.alipay.sdk.app.PayTask;
import com.maijiabao.haoo.R;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.Map;

public class AliPayPlugin extends CordovaPlugin {
    private static String TAG = "AliPayPlugin";

//    //商户PID
//    private String partner = "";
//    //商户收款账号
//    private String seller = "";
//    //商户私钥，pkcs8格式
//    private String privateKey = "";
  /** 支付宝支付业务：入参app_id    沙箱环境2016080400163280，正式环境2017022405851086*/
  public static final String APPID = "2017022405851086";

  /** 支付宝账户登录授权业务：入参pid值 */
  public static final String PID = "2088401651123489";
  /** 支付宝账户登录授权业务：入参target_id值 */
  public static final String TARGET_ID = "";

  /** 商户私钥，pkcs8格式 */
  /** 如下私钥，RSA2_PRIVATE 或者 RSA_PRIVATE 只需要填入一个 */
  /** 如果商户两个都设置了，优先使用 RSA2_PRIVATE */
  /** RSA2_PRIVATE 可以保证商户交易在更加安全的环境下进行，建议使用 RSA2_PRIVATE */
  /** 获取 RSA2_PRIVATE，建议使用支付宝提供的公私钥生成工具生成， */
  /** 工具地址：https://doc.open.alipay.com/docs/doc.htm?treeId=291&articleId=106097&docType=1 */
  public String RSA2_PRIVATE = "";
  public String RSA_PRIVATE = "";
  public String RequestContent = "";
  private static final int SDK_PAY_FLAG = 1;
  private static final int SDK_AUTH_FLAG = 2;
    @Override
    public void initialize(CordovaInterface cordova, CordovaWebView webView) {
        super.initialize(cordova, webView);
//        partner = webView.getPreferences().getString("partner", "");
//        seller = webView.getPreferences().getString("seller", "");
//        privateKey = webView.getPreferences().getString("privatekey", "");
     //   RSA2_PRIVATE = cordova.getActivity().getString(R.string.rsa2_private_key);
       EnvUtils.setEnv(EnvUtils.EnvEnum.SANDBOX);
    }

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) {
        try {
            JSONObject arguments = args.getJSONObject(0);
//            String tradeNo = arguments.getString("tradeNo");
//            String subject = arguments.getString("subject");
//            String body = arguments.getString("body");
//            String price = arguments.getString("price");
//            String notifyUrl = arguments.getString("notifyUrl");
//            this.pay(tradeNo, subject, body, price, notifyUrl, callbackContext);
          String content = arguments.getString("alipay_order_string");
       //content = content.replace("&amp;","&");
    //  String   content2 = "app_id=2016080400163280&biz_content=%7B%22timeout_express%22%3A%2230m%22%2C%22product_code%22%3A%22QUICK_MSECURITY_PAY%22%2C%22total_amount%22%3A%2219.9%22%2C%22subject%22%3A%22Haoo+%E6%94%AF%E4%BB%98%22%2C%22body%22%3A%22%22%2C%22out_trade_no%22%3A%222017032445%22%7D&charset=utf-8&method=alipay.trade.app.pay&notify_url=http%3A%2F%2Fhaoo.idealhere.com%2Fnotify%2FalipayNotify&sign_type=RSA2&timestamp=2017-03-24+07%3A36%3A11&version=1.0&sign=uRCh%2BpiYQU9atEldBI3WtidDWHE2VvjwCJA3vD3VofPrWbnQgeu1U7%2FoLUNgpx7GrkQJki08hIs7eWjoJnlFz3BEILie2dm5OnPhs45k%2BKY4zbjMspI416NwKN9gKqJf2acbY80YfUJZxoO9iNyNrUP1j%2F6kAeTd6pzfvLMiOOBrtofU9HsvekvbMXW61Hj2sBLRMvnczkyRpOB50VIvkipJ1m%2F%2BsG3uW1cn5xIWYOz8bEP63Lnh80GQdmNklHxKfmOKn4o40uVYOOYkSQo3i0cMps9DQU0baTNm6rGdkjNqRBym2E6YZAhwd0nh8Kf%2BNWYiHl5yhroUM3skzulhAg%3D%3D";
          this.payNew(callbackContext,content);
        } catch (JSONException e) {
            callbackContext.error(new JSONObject());
            e.printStackTrace();
            return false;
        }
        return true;
    }

  public void payNew(final CallbackContext callbackContext,final  String orderInfo){
    cordova.getThreadPool().execute(new Runnable() {
      @Override
      public void run() {
        // 构造PayTask 对象
        PayTask alipay = new PayTask(cordova.getActivity());
        // 调用支付接口，获取支付结果
        Map<String, String> result = alipay.payV2(orderInfo,true);
        PayResult payResult = new PayResult((Map<String, String>)result);
        try{
          JSONObject jobj  = new JSONObject();

          if (TextUtils.equals(payResult.getResultStatus(), "9000")) {
            callbackContext.success(new JSONObject(payResult.getResult()));
          } else {
            // 判断resultStatus 为非“9000”则代表可能支付失败
            // “8000”代表支付结果因为支付渠道原因或者系统原因还在等待支付结果确认，最终交易是否成功以服务端异步通知为准（小概率状态）
            if (TextUtils.equals(payResult.getResultStatus(), "8000")) {
              jobj.put("msg","支付中:"+payResult.getResult());
              callbackContext.error(jobj);
            } else {
              jobj.put("msg","支付失败:"+payResult.getResult());
              callbackContext.error(jobj);
            }
          }
        }catch (JSONException ex){
          ex.printStackTrace();
        }

      }
    });
  }

    public void pay(String tradeNo, String subject, String body, String price, String notifyUrl, final CallbackContext callbackContext) {
      if (TextUtils.isEmpty(APPID) || (TextUtils.isEmpty(RSA2_PRIVATE) && TextUtils.isEmpty(RSA_PRIVATE))) {
        new AlertDialog.Builder(cordova.getActivity()).setTitle("警告").setMessage("需要配置APPID | RSA_PRIVATE")
          .setPositiveButton("确定", new DialogInterface.OnClickListener() {
            public void onClick(DialogInterface dialoginterface, int i) {
              //
              cordova.getActivity().finish();
            }
          }).show();
        return;
      }

      boolean rsa2 = (RSA2_PRIVATE.length() > 0);
      Map<String, String> params = OrderInfoUtil2_0.buildOrderParamMap(APPID, rsa2);
      String orderParam = OrderInfoUtil2_0.buildOrderParam(params);

      String privateKey = rsa2 ? RSA2_PRIVATE : RSA_PRIVATE;
      String sign = OrderInfoUtil2_0.getSign(params, privateKey, rsa2);
      final String orderInfo = orderParam + "&" + sign;


        cordova.getThreadPool().execute(new Runnable() {
            @Override
            public void run() {
                // 构造PayTask 对象
                PayTask alipay = new PayTask(cordova.getActivity());
                // 调用支付接口，获取支付结果
              Map<String, String> result = alipay.payV2(orderInfo,true);
                PayResult payResult = new PayResult((Map<String, String>)result);

                if (TextUtils.equals(payResult.getResultStatus(), "9000")) {
                    callbackContext.success(payResult.toJson());
                } else {
                    // 判断resultStatus 为非“9000”则代表可能支付失败
                    // “8000”代表支付结果因为支付渠道原因或者系统原因还在等待支付结果确认，最终交易是否成功以服务端异步通知为准（小概率状态）
                    if (TextUtils.equals(payResult.getResultStatus(), "8000")) {
                        callbackContext.success(payResult.toJson());
                    } else {
                        callbackContext.error(payResult.toJson());
                    }
                }
            }
        });
    }


}
