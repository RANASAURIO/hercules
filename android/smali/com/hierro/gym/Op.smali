.class public Lcom/hierro/gym/Op;
.super Ljava/lang/Object;
.source "Op.java"

# interfaces
.implements Ljava/lang/Runnable;


# instance fields
.field public act:Lcom/hierro/gym/MainActivity;

.field public code:I

.field public data:Ljava/lang/String;

.field public flag:Z

.field public mime:Ljava/lang/String;

.field public name:Ljava/lang/String;


# direct methods
.method public constructor <init>()V
    .locals 0

    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method


# virtual methods
.method public run()V
    .locals 9

    iget-object v2, p0, Lcom/hierro/gym/Op;->act:Lcom/hierro/gym/MainActivity;

    if-eqz v2, :cond_end

    iget v0, p0, Lcom/hierro/gym/Op;->code:I

    const/4 v1, 0x1

    if-eq v0, v1, :cond_save

    const/4 v1, 0x2

    if-eq v0, v1, :cond_bars

    const/4 v1, 0x3

    if-eq v0, v1, :cond_keep

    :cond_end
    return-void

    :cond_save
    iget-object v3, p0, Lcom/hierro/gym/Op;->data:Ljava/lang/String;

    iput-object v3, v2, Lcom/hierro/gym/MainActivity;->pending:Ljava/lang/String;

    new-instance v4, Landroid/content/Intent;

    const-string v5, "android.intent.action.CREATE_DOCUMENT"

    invoke-direct {v4, v5}, Landroid/content/Intent;-><init>(Ljava/lang/String;)V

    const-string v5, "android.intent.category.OPENABLE"

    invoke-virtual {v4, v5}, Landroid/content/Intent;->addCategory(Ljava/lang/String;)Landroid/content/Intent;

    iget-object v5, p0, Lcom/hierro/gym/Op;->mime:Ljava/lang/String;

    invoke-virtual {v4, v5}, Landroid/content/Intent;->setType(Ljava/lang/String;)Landroid/content/Intent;

    const-string v5, "android.intent.extra.TITLE"

    iget-object v6, p0, Lcom/hierro/gym/Op;->name:Ljava/lang/String;

    invoke-virtual {v4, v5, v6}, Landroid/content/Intent;->putExtra(Ljava/lang/String;Ljava/lang/String;)Landroid/content/Intent;

    :try_start_0
    const/16 v5, 0x2a

    invoke-virtual {v2, v4, v5}, Landroid/app/Activity;->startActivityForResult(Landroid/content/Intent;I)V
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0

    return-void

    :catch_0
    move-exception v5

    const/4 v6, 0x0

    invoke-virtual {v2, v6}, Lcom/hierro/gym/MainActivity;->notifySaved(Z)V

    return-void

    :cond_bars
    invoke-virtual {v2}, Landroid/app/Activity;->getWindow()Landroid/view/Window;

    move-result-object v3

    invoke-virtual {v3}, Landroid/view/Window;->getDecorView()Landroid/view/View;

    move-result-object v6

    iget-object v7, v2, Lcom/hierro/gym/MainActivity;->web:Landroid/webkit/WebView;

    sget v8, Landroid/os/Build$VERSION;->SDK_INT:I

    iget-boolean v4, p0, Lcom/hierro/gym/Op;->flag:Z

    if-eqz v4, :cond_light

    const v5, -0xeae3d9

    invoke-virtual {v3, v5}, Landroid/view/Window;->setStatusBarColor(I)V

    if-eqz v7, :cond_dark_nav

    invoke-virtual {v7, v5}, Landroid/webkit/WebView;->setBackgroundColor(I)V

    :cond_dark_nav
    const v5, -0xe1d8cc

    invoke-virtual {v3, v5}, Landroid/view/Window;->setNavigationBarColor(I)V

    const/4 v5, 0x0

    invoke-virtual {v6, v5}, Landroid/view/View;->setSystemUiVisibility(I)V

    return-void

    :cond_light
    const v5, -0x171412

    invoke-virtual {v3, v5}, Landroid/view/Window;->setStatusBarColor(I)V

    if-eqz v7, :cond_light_nav

    invoke-virtual {v7, v5}, Landroid/webkit/WebView;->setBackgroundColor(I)V

    :cond_light_nav
    const/16 v4, 0x1a

    if-lt v8, v4, :cond_old

    const/4 v5, -0x1

    invoke-virtual {v3, v5}, Landroid/view/Window;->setNavigationBarColor(I)V

    const/16 v5, 0x2010

    invoke-virtual {v6, v5}, Landroid/view/View;->setSystemUiVisibility(I)V

    return-void

    :cond_old
    const v5, -0xe8dfd5

    invoke-virtual {v3, v5}, Landroid/view/Window;->setNavigationBarColor(I)V

    const/16 v5, 0x2000

    invoke-virtual {v6, v5}, Landroid/view/View;->setSystemUiVisibility(I)V

    return-void

    :cond_keep
    invoke-virtual {v2}, Landroid/app/Activity;->getWindow()Landroid/view/Window;

    move-result-object v3

    const/16 v5, 0x80

    iget-boolean v4, p0, Lcom/hierro/gym/Op;->flag:Z

    if-eqz v4, :cond_clear

    invoke-virtual {v3, v5}, Landroid/view/Window;->addFlags(I)V

    return-void

    :cond_clear
    invoke-virtual {v3, v5}, Landroid/view/Window;->clearFlags(I)V

    return-void
.end method
