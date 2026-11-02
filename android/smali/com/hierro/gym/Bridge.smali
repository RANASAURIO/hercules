.class public Lcom/hierro/gym/Bridge;
.super Ljava/lang/Object;
.source "Bridge.java"


# instance fields
.field private final act:Lcom/hierro/gym/MainActivity;


# direct methods
.method public constructor <init>(Lcom/hierro/gym/MainActivity;)V
    .locals 0

    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    iput-object p1, p0, Lcom/hierro/gym/Bridge;->act:Lcom/hierro/gym/MainActivity;

    return-void
.end method


# virtual methods
.method public save(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V
    .locals 3
    .annotation runtime Landroid/webkit/JavascriptInterface;
    .end annotation

    # solo copias (.json) y series (.csv)
    const-string v0, "application/json"

    invoke-virtual {v0, p2}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-nez v0, :cond_ok

    const-string v0, "text/csv"

    invoke-virtual {v0, p2}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-nez v0, :cond_ok

    return-void

    :cond_ok
    new-instance v0, Lcom/hierro/gym/Op;

    invoke-direct {v0}, Lcom/hierro/gym/Op;-><init>()V

    iget-object v1, p0, Lcom/hierro/gym/Bridge;->act:Lcom/hierro/gym/MainActivity;

    iput-object v1, v0, Lcom/hierro/gym/Op;->act:Lcom/hierro/gym/MainActivity;

    const/4 v2, 0x1

    iput v2, v0, Lcom/hierro/gym/Op;->code:I

    iput-object p1, v0, Lcom/hierro/gym/Op;->name:Ljava/lang/String;

    iput-object p2, v0, Lcom/hierro/gym/Op;->mime:Ljava/lang/String;

    iput-object p3, v0, Lcom/hierro/gym/Op;->data:Ljava/lang/String;

    invoke-virtual {v1, v0}, Landroid/app/Activity;->runOnUiThread(Ljava/lang/Runnable;)V

    return-void
.end method

.method public bars(Z)V
    .locals 3
    .annotation runtime Landroid/webkit/JavascriptInterface;
    .end annotation

    new-instance v0, Lcom/hierro/gym/Op;

    invoke-direct {v0}, Lcom/hierro/gym/Op;-><init>()V

    iget-object v1, p0, Lcom/hierro/gym/Bridge;->act:Lcom/hierro/gym/MainActivity;

    iput-object v1, v0, Lcom/hierro/gym/Op;->act:Lcom/hierro/gym/MainActivity;

    const/4 v2, 0x2

    iput v2, v0, Lcom/hierro/gym/Op;->code:I

    iput-boolean p1, v0, Lcom/hierro/gym/Op;->flag:Z

    invoke-virtual {v1, v0}, Landroid/app/Activity;->runOnUiThread(Ljava/lang/Runnable;)V

    return-void
.end method

.method public keepOn(Z)V
    .locals 3
    .annotation runtime Landroid/webkit/JavascriptInterface;
    .end annotation

    new-instance v0, Lcom/hierro/gym/Op;

    invoke-direct {v0}, Lcom/hierro/gym/Op;-><init>()V

    iget-object v1, p0, Lcom/hierro/gym/Bridge;->act:Lcom/hierro/gym/MainActivity;

    iput-object v1, v0, Lcom/hierro/gym/Op;->act:Lcom/hierro/gym/MainActivity;

    const/4 v2, 0x3

    iput v2, v0, Lcom/hierro/gym/Op;->code:I

    iput-boolean p1, v0, Lcom/hierro/gym/Op;->flag:Z

    invoke-virtual {v1, v0}, Landroid/app/Activity;->runOnUiThread(Ljava/lang/Runnable;)V

    return-void
.end method
