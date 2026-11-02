.class public Lcom/hierro/gym/MainActivity;
.super Landroid/app/Activity;
.source "MainActivity.java"


# instance fields
.field public fileCb:Landroid/webkit/ValueCallback;

.field public pending:Ljava/lang/String;

.field public web:Landroid/webkit/WebView;


# direct methods
.method public constructor <init>()V
    .locals 0

    invoke-direct {p0}, Landroid/app/Activity;-><init>()V

    return-void
.end method


# virtual methods
.method protected onCreate(Landroid/os/Bundle;)V
    .locals 5

    invoke-super {p0, p1}, Landroid/app/Activity;->onCreate(Landroid/os/Bundle;)V

    new-instance v0, Landroid/webkit/WebView;

    invoke-direct {v0, p0}, Landroid/webkit/WebView;-><init>(Landroid/content/Context;)V

    iput-object v0, p0, Lcom/hierro/gym/MainActivity;->web:Landroid/webkit/WebView;

    invoke-virtual {v0}, Landroid/webkit/WebView;->getSettings()Landroid/webkit/WebSettings;

    move-result-object v1

    const/4 v2, 0x1

    invoke-virtual {v1, v2}, Landroid/webkit/WebSettings;->setJavaScriptEnabled(Z)V

    invoke-virtual {v1, v2}, Landroid/webkit/WebSettings;->setDomStorageEnabled(Z)V

    invoke-virtual {v1, v2}, Landroid/webkit/WebSettings;->setDatabaseEnabled(Z)V

    const/4 v3, 0x0

    invoke-virtual {v1, v3}, Landroid/webkit/WebSettings;->setMediaPlaybackRequiresUserGesture(Z)V

    const/16 v3, 0x64

    invoke-virtual {v1, v3}, Landroid/webkit/WebSettings;->setTextZoom(I)V

    # seguridad: sin acceso a archivos del teléfono ni ubicación (los assets siguen funcionando)
    const/4 v3, 0x0

    invoke-virtual {v1, v3}, Landroid/webkit/WebSettings;->setAllowFileAccess(Z)V

    invoke-virtual {v1, v3}, Landroid/webkit/WebSettings;->setAllowFileAccessFromFileURLs(Z)V

    invoke-virtual {v1, v3}, Landroid/webkit/WebSettings;->setAllowUniversalAccessFromFileURLs(Z)V

    invoke-virtual {v1, v3}, Landroid/webkit/WebSettings;->setGeolocationEnabled(Z)V

    const v3, -0xeaeef2

    invoke-virtual {v0, v3}, Landroid/webkit/WebView;->setBackgroundColor(I)V

    new-instance v3, Lcom/hierro/gym/Client;

    invoke-direct {v3}, Lcom/hierro/gym/Client;-><init>()V

    invoke-virtual {v0, v3}, Landroid/webkit/WebView;->setWebViewClient(Landroid/webkit/WebViewClient;)V

    new-instance v3, Lcom/hierro/gym/Chrome;

    invoke-direct {v3, p0}, Lcom/hierro/gym/Chrome;-><init>(Lcom/hierro/gym/MainActivity;)V

    invoke-virtual {v0, v3}, Landroid/webkit/WebView;->setWebChromeClient(Landroid/webkit/WebChromeClient;)V

    new-instance v3, Lcom/hierro/gym/Bridge;

    invoke-direct {v3, p0}, Lcom/hierro/gym/Bridge;-><init>(Lcom/hierro/gym/MainActivity;)V

    const-string v4, "HierroAndroid"

    invoke-virtual {v0, v3, v4}, Landroid/webkit/WebView;->addJavascriptInterface(Ljava/lang/Object;Ljava/lang/String;)V

    invoke-virtual {p0, v0}, Landroid/app/Activity;->setContentView(Landroid/view/View;)V

    const-string v3, "file:///android_asset/index.html"

    invoke-virtual {v0, v3}, Landroid/webkit/WebView;->loadUrl(Ljava/lang/String;)V

    return-void
.end method

.method public onBackPressed()V
    .locals 3

    iget-object v0, p0, Lcom/hierro/gym/MainActivity;->web:Landroid/webkit/WebView;

    if-eqz v0, :cond_exit

    const-string v1, "(window.hierroBack && window.hierroBack()) ? true : false"

    new-instance v2, Lcom/hierro/gym/BackCb;

    invoke-direct {v2, p0}, Lcom/hierro/gym/BackCb;-><init>(Lcom/hierro/gym/MainActivity;)V

    invoke-virtual {v0, v1, v2}, Landroid/webkit/WebView;->evaluateJavascript(Ljava/lang/String;Landroid/webkit/ValueCallback;)V

    return-void

    :cond_exit
    invoke-super {p0}, Landroid/app/Activity;->onBackPressed()V

    return-void
.end method

.method protected onActivityResult(IILandroid/content/Intent;)V
    .locals 5

    invoke-super {p0, p1, p2, p3}, Landroid/app/Activity;->onActivityResult(IILandroid/content/Intent;)V

    const/16 v0, 0x2b

    if-ne p1, v0, :cond_notfile

    iget-object v1, p0, Lcom/hierro/gym/MainActivity;->fileCb:Landroid/webkit/ValueCallback;

    if-eqz v1, :cond_done

    invoke-static {p2, p3}, Landroid/webkit/WebChromeClient$FileChooserParams;->parseResult(ILandroid/content/Intent;)[Landroid/net/Uri;

    move-result-object v2

    invoke-interface {v1, v2}, Landroid/webkit/ValueCallback;->onReceiveValue(Ljava/lang/Object;)V

    const/4 v2, 0x0

    iput-object v2, p0, Lcom/hierro/gym/MainActivity;->fileCb:Landroid/webkit/ValueCallback;

    :cond_done
    return-void

    :cond_notfile
    const/16 v0, 0x2a

    if-ne p1, v0, :cond_done

    const/4 v0, -0x1

    if-ne p2, v0, :cond_fail

    if-eqz p3, :cond_fail

    :try_start_0
    invoke-virtual {p3}, Landroid/content/Intent;->getData()Landroid/net/Uri;

    move-result-object v1

    invoke-virtual {p0}, Landroid/app/Activity;->getContentResolver()Landroid/content/ContentResolver;

    move-result-object v2

    invoke-virtual {v2, v1}, Landroid/content/ContentResolver;->openOutputStream(Landroid/net/Uri;)Ljava/io/OutputStream;

    move-result-object v2

    iget-object v3, p0, Lcom/hierro/gym/MainActivity;->pending:Ljava/lang/String;

    const-string v4, "UTF-8"

    invoke-virtual {v3, v4}, Ljava/lang/String;->getBytes(Ljava/lang/String;)[B

    move-result-object v3

    invoke-virtual {v2, v3}, Ljava/io/OutputStream;->write([B)V

    invoke-virtual {v2}, Ljava/io/OutputStream;->close()V
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :cond_fail

    const/4 v0, 0x1

    invoke-virtual {p0, v0}, Lcom/hierro/gym/MainActivity;->notifySaved(Z)V

    goto :goto_clear

    :cond_fail
    const/4 v0, 0x0

    invoke-virtual {p0, v0}, Lcom/hierro/gym/MainActivity;->notifySaved(Z)V

    :goto_clear
    const/4 v0, 0x0

    iput-object v0, p0, Lcom/hierro/gym/MainActivity;->pending:Ljava/lang/String;

    return-void
.end method

.method public notifySaved(Z)V
    .locals 3

    iget-object v0, p0, Lcom/hierro/gym/MainActivity;->web:Landroid/webkit/WebView;

    if-eqz v0, :cond_end

    if-eqz p1, :cond_no

    const-string v1, "window.hierroSaved && window.hierroSaved(true)"

    goto :goto_run

    :cond_no
    const-string v1, "window.hierroSaved && window.hierroSaved(false)"

    :goto_run
    const/4 v2, 0x0

    invoke-virtual {v0, v1, v2}, Landroid/webkit/WebView;->evaluateJavascript(Ljava/lang/String;Landroid/webkit/ValueCallback;)V

    :cond_end
    return-void
.end method
