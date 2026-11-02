.class public Lcom/hierro/gym/Chrome;
.super Landroid/webkit/WebChromeClient;
.source "Chrome.java"


# instance fields
.field private final act:Lcom/hierro/gym/MainActivity;


# direct methods
.method public constructor <init>(Lcom/hierro/gym/MainActivity;)V
    .locals 0

    invoke-direct {p0}, Landroid/webkit/WebChromeClient;-><init>()V

    iput-object p1, p0, Lcom/hierro/gym/Chrome;->act:Lcom/hierro/gym/MainActivity;

    return-void
.end method


# virtual methods
.method public onShowFileChooser(Landroid/webkit/WebView;Landroid/webkit/ValueCallback;Landroid/webkit/WebChromeClient$FileChooserParams;)Z
    .locals 4

    iget-object v0, p0, Lcom/hierro/gym/Chrome;->act:Lcom/hierro/gym/MainActivity;

    iget-object v1, v0, Lcom/hierro/gym/MainActivity;->fileCb:Landroid/webkit/ValueCallback;

    if-eqz v1, :cond_nocb

    const/4 v2, 0x0

    invoke-interface {v1, v2}, Landroid/webkit/ValueCallback;->onReceiveValue(Ljava/lang/Object;)V

    :cond_nocb
    iput-object p2, v0, Lcom/hierro/gym/MainActivity;->fileCb:Landroid/webkit/ValueCallback;

    :try_start_0
    invoke-virtual {p3}, Landroid/webkit/WebChromeClient$FileChooserParams;->createIntent()Landroid/content/Intent;

    move-result-object v1

    const/16 v2, 0x2b

    invoke-virtual {v0, v1, v2}, Landroid/app/Activity;->startActivityForResult(Landroid/content/Intent;I)V
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0

    const/4 v3, 0x1

    return v3

    :catch_0
    move-exception v1

    const/4 v2, 0x0

    iput-object v2, v0, Lcom/hierro/gym/MainActivity;->fileCb:Landroid/webkit/ValueCallback;

    invoke-interface {p2, v2}, Landroid/webkit/ValueCallback;->onReceiveValue(Ljava/lang/Object;)V

    const/4 v3, 0x1

    return v3
.end method
